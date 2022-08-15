import Image from "next/image"
import styles from "./NFTCard.module.css"
import { useRouter } from "next/router"
import networkMapping from "../../constants/networkMapping.json"
import marketplaceABI from "../../constants/NFTMarketplace.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { ethers } from "ethers"
import { truncateStr } from "../../utils/truncateStr"
import { useNotification } from "../../utils/NotificationProvider"


export default function NFTCard({ price, nftAddress, name, imageURI, tokenId, seller, account, signer, chainId, type, collectionName })
{
  const [collectNFT, setCollectNFT] = useState(false)
  const [newPrice, setNewPrice] = useState(null)
  const router = useRouter()
  const dispatch = useNotification()

  const marketplaceAddress = networkMapping[chainId]["NFTMarketplace"][0]
  // console.log(price)

  async function buyNFT()
  {
    if(seller == account){
      dispatch({
        withHeader: false,
        body: "You already own this NFT, visit the Sell-NFTs page if you want to remove it from the marketplace",
        type: "failure"
      })
    }
    else
    {
      const MarketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer)
      try{
        const buyNFTTx = await MarketplaceContract.buyItem(nftAddress, tokenId, { value: price })
        const buyNFTTxR = await buyNFTTx.wait(1)
        if(buyNFTTxR){
          dispatch({
            withHeader: true,
            header: "Successfully Purchased",
            body: "You've collected your NFT",
            type: "success"
          })
          // router.reload()
        } 
      }catch(e){console.log(e)}
    }
  }

  async function handleRemoveNFT()
  {
    if(window.ethereum !== "undefined")
    {
      const MarketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer)
      // console.log(nftAddress, tokenId)
      try{
        const removeNFTTx = await MarketplaceContract.cancelListing(nftAddress, tokenId)
        const removeNFTTxR = await removeNFTTx.wait(1)
        if(removeNFTTxR){
          dispatch({
            withHeader: true,
            header: "Successfully Removed",
            body: "Your NFT has been removed from Apio",
            type: "success"
          })
        }
      }catch(e){console.log(e)}
    }
  }

  async function handleUpdateNFT()
  {
    if(window.ethereum !== "undefined")
    {
      const MarketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer)
      try{
        const weiPrice = ethers.utils.parseUnits(newPrice, "ether").toString()
        const updateNFTTx = await MarketplaceContract.updateListing(nftAddress, tokenId, weiPrice)
        const updateNFTTxR = await updateNFTTx.wait(1)
        if(updateNFTTxR){
          dispatch({
            withHeader: true,
            header: "Successfully Updated",
            body: "Your NFT has been successfully Updated",
            type: "success"
          })
        }
      }catch(e){console.log(e)}
    }
  }

  // useEffect(()=>{return(<NFTCard/>)},[tokenId, dispatch])


  return (
    <div className={styles["apio__NFTCard"]} onMouseEnter={()=>{setCollectNFT(true)}} onMouseLeave={()=>{setCollectNFT(false)}}>
      <div className={styles["apio__NFTCard--image"]}>
        <div className={styles["nimg"]}><Image loader={()=>imageURI} src={imageURI} alt="example" layout="fill" objectFit="cover"/></div>
      </div>
      <div className={styles["apio__NFTCard--text"]}>
        { type !== "userListing"
          ?
          <h3 className={styles["apio__NFTCard--text--name"]}>{`${name} #0${tokenId}`}</h3>
          :
          <div className={styles["apio__NFTCard--text--user_options"]}>
            <h3 className={styles["apio__NFTCard--text--user_options--name"]}>{`${name} #0${tokenId}`}</h3>
            <button className={styles["apio__NFTCard--removeNFT"]} onClick={handleRemoveNFT}><p>Remove NFT</p></button>
          </div>
        }
      
        { type !== "userListing"
          ? <p className={styles["apio__NFTCard--creator"]}>owner: {seller == account ? "you" : "@" + truncateStr(seller || "", 12)}</p>
          : <p className={styles["apio__NFTCard--creator"]}>collection: {collectionName}</p>
        }
      
        <div className={styles["apio__NFTCard--text--price"]}>
          <h3>{ethers.utils.formatUnits(price, "ether")} rETH</h3>
          <p>
            <FontAwesomeIcon icon="fa-brands fa-ethereum" className={styles["apio__NFTCard--eth_icon"]}/>
          </p>
        </div>
        { type !== "userListing"
          ?
          <div className={collectNFT ? styles["apio__NFTCard--collectNFT"] : styles["hide_collectNFT"]}>
            <button onClick={buyNFT}>Buy Now!</button>
          </div>
          :
          <div className={collectNFT ? styles["apio__NFTCard--updateNFT"] : styles["hide_updateNFT"]}>
            <div className={styles["apio__NFTCard--updateNFT--container"]}>
              <input type="number" placeholder="New Price" onChange={event => setNewPrice(event.target.value)} value={newPrice}/>
              <button onClick={handleUpdateNFT}>Update</button>
            </div>
          </div>
        }
      </div>
    </div>

  )
}