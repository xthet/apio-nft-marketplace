import { useEffect, useState } from "react"
import styles from "./NFTVendor.module.css"
import { ethers } from "ethers"
import { truncateStr } from "../../utils/truncateStr"
import NFTMarketplaceABI from "../../constants/NFTMarketplace.json"
import networkMapping from "../../constants/networkMapping.json"
import getABI from "../../utils/getABI"
import { useNotification } from "../../utils/NotificationProvider"

export default function NFTVendor({ connect, isConnected, chainId, signer, account })
{
  const [NFTAddress, setNFTAddress] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [price, setPrice] = useState("")
  const [listedSuccessfully, setListedSuccessfully] = useState(false)
  const [earnings, setEarnings] = useState("0")
  const marketplace = networkMapping[chainId]["NFTMarketplace"]
  const marketplaceAddress = marketplace[marketplace.length - 1]
  const dispatch = useNotification()

  async function approveAndList()
  {
    if (typeof window.ethereum !== "undefined")
    {
      console.log("Approving...")
      const contractABI = await getABI(NFTAddress)
      const NFTContract = new ethers.Contract(NFTAddress, contractABI, signer)
      try{
        const approveTx = await NFTContract.approve(marketplaceAddress, tokenId)
        const approveTxR = await approveTx.wait(1)
        const weiPrice = ethers.utils.parseUnits(price, "ether").toString()
        console.log(weiPrice)
        if(approveTxR){
          dispatch({
            withHeader: true,
            header: "Approved Successfully",
            body: "Your NFT has been approved for the marketplace",
            type: "success"
          })
        }
        await listNFT(NFTAddress, tokenId, weiPrice)
      }catch(e){console.log(e)}
    }

    async function listNFT(NFTAddress, tokenId, price)
    {
      if (typeof window.ethereum !== "undefined")
      {
        console.log("Listing...")
        const NFTMarketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplaceABI, signer)
        try{
          const listTx = await NFTMarketplaceContract.listItem(NFTAddress, tokenId, price)
          const listTxR = await listTx.wait(1)
          setListedSuccessfully(true)
          if(listTxR){
            dispatch({
              withHeader: true,
              header: "Listed Successfully",
              body: "Your NFT is now on the marketplace",
              type: "success"
            })
          }
        }catch(e){console.log(e)}
      }
    }
  }

  async function handleSubmit(event)
  {
    event.preventDefault()
    

    await approveAndList()

    setNFTAddress("")
    setTokenId("")
    setPrice("")
  }

  async function withdrawEarnings()
  {
    if (typeof window.ethereum !== "undefined")
    {
      console.log("Withdrawing...")
      const NFTMarketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplaceABI, signer)
      try{
        const withdrawTx = await NFTMarketplaceContract.withdrawProceeds()
        const withdrawTxR = await withdrawTx.wait(1)
        dispatch({
          withHeader: true,
          header: "Withdrawn Successfully",
          body: "Your earnings have been sent to your wallet",
          type: "success"
        })
        setUpProfile()
      }catch(e){console.log(e)}
    }
  }

  async function setUpProfile()
  {
    if (typeof window.ethereum !== "undefined")
    {
      const NFTMarketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplaceABI, signer)
      try{
        const proceeds = await NFTMarketplaceContract.getProceeds(account)
        if(proceeds){setEarnings(proceeds.toString())}
      }catch(e){console.log(e)}
    }
  }

  useEffect(()=>{
    if(isConnected){
      setUpProfile()
    }
  }, [earnings, account, isConnected, chainId])


  return (
    <div className={`section__padding ${styles["apio__NFTVendor"]}`}>
      <div className={styles["apio__NFTVendor--listNFT"]}>
        <h1>List a new NFT</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="NFT Address" onChange={event => setNFTAddress(event.target.value)} value={NFTAddress}/>
          <input type="number" placeholder="Token ID" onChange={event => setTokenId(event.target.value)} value={tokenId}/>
          <input type="number" placeholder="Price (in ETH)" onChange={event => setPrice(event.target.value)} value={price}/>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className={styles["apio__NFTVendor--vendor_profile"]}>
        <div className={styles["apio__NFTVendor--vendor_profile--account"]}>
          <div></div>
          <p>{truncateStr(account || "", 12)}</p>
        </div>
        <div className={styles["apio__NFTVendor--vendor_profile--earnings"]}>
          <p>Current Earnings: {ethers.utils.formatUnits(earnings, "ether")} rETH</p>
        </div>
        {earnings != "0" 
          ? <button onClick={withdrawEarnings} className={styles["apio__NFTVendor--vendor_profile--withdraw"]}>Withdraw Earnings</button> 
          : <button disabled={true} className={styles["apio__NFTVendor--vendor_profile--withdraw"]}>No Earnings Detected!</button>
        }
      </div>
    </div>
  )
}