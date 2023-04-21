import { ApolloClient, InMemoryCache } from "@apollo/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ethers } from "ethers"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import marketplaceABI from "../../constants/abis/NFTMarketplace.json"
import networkMapping from "../../constants/networkMapping.json"
import { GET_COLLECTION, GET_NFT } from "../../constants/subGraphQueries"
import { useNotification } from "../../utils/NotificationProvider"
import { truncateStr } from "../../utils/truncateStr"
import styles from "./NFTCard.module.css"


export default function NFTCard({ price, nftAddress, tokenId, seller, account, signer, chainId, type, isConnected })
{
  const [collectNFT, setCollectNFT] = useState(false)
  const [newPrice, setNewPrice] = useState(0)
  const [collectionName, setCollectionName] = useState(undefined)
  const [tokenName, setTokenName] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [tokenDescription, setTokenDescription] = useState("")   
  const [imageURI, setImageURI] = useState("")
  const [collectionImageURI, setCollectionImageURI] = useState("") 
  
  const router = useRouter()
  const dispatch = useNotification()
  // const { tokenName, tokenDescription, imageURI, collectionImageURI, getTokenURI } = useTokenURI()


  const marketplace = networkMapping[chainId]["NFTMarketplace"]
  const marketplaceAddress = marketplace[marketplace.length - 1]

 
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
    cache: new InMemoryCache(),
  })

  
  async function getNFTData()
  {
    const activeNFTAddress = await nftAddress
    const collectionData = await client
      .query({
        query: GET_COLLECTION,
        variables: { activeCollection: activeNFTAddress },
      })
      .then(async (data) => {
        // console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })

    collectionData && setCollectionName(collectionData.data.collectionFound.name)
    const collURI = collectionData.data.collectionFound.tokenURI
    const collImgURI = await fetch(collURI.replace("ipfs://", "https://ipfs.io/ipfs/")).then(res=>res.json()).then(data=>data.image.replace("ipfs://", "https://ipfs.io/ipfs/"))
    setCollectionImageURI(collImgURI)
    
    const NFTID = tokenId.toString() + nftAddress
    const NFTData = await client
      .query({
        query: GET_NFT,
        variables: { id: NFTID },
      })
      .then(data => data)
      .catch(err=>console.log(err))

    setTokenName(NFTData.data.activeItem.symbol)
    const tokenURI = collectionData.data.collectionFound.tokenURI
    const imgURI = await fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")).then(res=>res.json()).then(data=>data.image.replace("ipfs://", "https://ipfs.io/ipfs/"))
    setImageURI(imgURI)
  }


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
      const MarketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI.abi, signer)
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
      const MarketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI.abi, signer)
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
      const MarketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceABI.abi, signer)
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

  useEffect(()=>{
    async function setUpCard()
    {
      await getNFTData()
    }
    setUpCard()
  }, [isConnected, imageURI, tokenName, loaded])

  return (
    <div className={styles["apio__NFTCard"]} onMouseEnter={()=>{setCollectNFT(true)}} onMouseLeave={()=>{setCollectNFT(false)}}>
      <div className={styles["apio__NFTCard--image"]}>
        { imageURI && <div className={styles["nimg"]}><Image onLoad={()=>{setLoaded(true)}} loader={()=>imageURI} src={imageURI} alt="example" layout="fill" objectFit="cover"/></div>}
      </div>
      <div className={styles["apio__NFTCard--text"]}>
        { type !== "userListing"
          ?
          <h3 className={styles["apio__NFTCard--text--name"]}>{`${tokenName} #0${tokenId}`}</h3>
          :
          <div className={styles["apio__NFTCard--text--user_options"]}>
            <h3 className={styles["apio__NFTCard--text--user_options--name"]}>{`${tokenName} #0${tokenId}`}</h3>
            <button className={styles["apio__NFTCard--removeNFT"]} onClick={handleRemoveNFT}><p>Remove NFT</p></button>
          </div>
        }
      
        { type !== "userListing"
          ? <p className={styles["apio__NFTCard--creator"]}>owner: {seller == account ? "you" : "@" + truncateStr(seller || "", 12)}</p>
          : <p className={styles["apio__NFTCard--creator"]}>collection: {collectionName}</p>
        }
      
        <div className={styles["apio__NFTCard--text--price"]}>
          <h3>{ethers.utils.formatUnits(price, "ether")} sETH</h3>
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