import { ApolloClient, InMemoryCache } from "@apollo/client"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { CollectionHeader, NFTCard } from "../../components/exportComps"
import { GET_NFTS } from "../../constants/subGraphQueries"
import styles from "./NFTGrid.module.css"

export default function NFTGrid({ connect, isConnected, chainId, signer, address, account })
{
  const [currentNFTData, setCurrentNFTData] = useState([])
  const [currentOffset, setCurrentOffset] = useState(0)
  const [cardPrice, setCardPrice] = useState(ethers.BigNumber.from("0"))
  
  async function getNFTData()
  {
    const activeNFTAddress = await address
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })

    const NFTData = await client
      .query({
        query: GET_NFTS,
        variables: { activeNFTAddress: activeNFTAddress, offset: currentOffset },
      })
      .then(async (data) => {
        // console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    if(currentOffset == 0){
      setCurrentNFTData(NFTData.data.activeItems)
    }else{
      setCurrentNFTData(prev=>[...prev, ...NFTData.data.activeItems])
    }
  }

  useEffect(()=>
  {
    async function runUI()
    {
      await getNFTData()
    }
    runUI()
  },[isConnected, currentOffset])

  return (
    <div className={`section__padding ${styles["apio__NFTGrid"]}`}>
      {!address ? console.log("Loading..") : !currentNFTData ? <p>Loading...</p> 
        : <CollectionHeader address={address} isConnected={isConnected} signer={signer}/>
      }
      {/* <div className={isConnected ? styles["apio__NFTGrid--isConnected"] : styles["apio__NFTGrid--toConnect"]}> */}
      <div className={styles["apio__NFTGrid--isConnected"]}>
        <p>You need to connect your wallet to view NFTs</p>
        <button onClick={connect}>Connect your wallet</button>
      </div>
      <div className={styles["apio__NFTGrid--grid_container"]}>
        {/* <div className={isConnected ? styles["apio__NFTGrid--grid"] : styles["apio__NFTGrid--notConnected"]}> */}
        <div className={styles["apio__NFTGrid--grid"]}>
          {!currentNFTData ? <p>Loading...</p> : currentNFTData.map((NFT, index)=>{
            const { price, tokenId, nftAddress, seller } = NFT
            return (
              <NFTCard
                key={index}
                price={price}
                nftAddress={nftAddress}
                tokenId={tokenId}
                seller={seller}
                account={account}
                chainId={chainId}
                signer={signer}
                isConnected={isConnected}
                // type={"userListing"}
              />
            )
          })}
        </div>
      </div>
      {currentNFTData.length > 5 && <button className={styles["apio__NFTGrid--cta"]} onClick={()=>{setCurrentOffset(prev=>prev + 10)}}>{"See more"}</button>}
    </div>
  )
}