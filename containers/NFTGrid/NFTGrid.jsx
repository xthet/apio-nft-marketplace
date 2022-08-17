import styles from "./NFTGrid.module.css"
import { CollectionHeader, NFTCard } from "../../components/exportComps"
import { GET_NFTS, GET_FLOOR_NFT, GET_COLLECTION } from "../../constants/subGraphQueries"
import { useQuery, ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"

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
        query: gql(GET_NFTS),
        variables: { activeNFTAddress: activeNFTAddress, offset: currentOffset },
      })
      .then(async (data) => {
        // console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })

    setCurrentNFTData(prev => [...prev, ...NFTData.data.activeItems])
    // console.log(currentOffset)
  }

  function handleGridScroll({ currentTarget })
  {
    console.log(currentTarget.clientHeight, currentTarget.scrollTop, currentTarget.scrollHeight)
    if(currentTarget.clientHeight + currentTarget.scrollTop + 1 >= currentTarget.scrollHeight)
    {
      if(currentTarget.clientHeight !== currentTarget.scrollHeight)
      {
        setCurrentOffset(prev => prev + 5)
        console.log("here")
      }
    }
  }

  useEffect(()=>
  {
    async function runUI()
    {
      await getNFTData()
    }
    isConnected && runUI()
  },[isConnected, currentOffset])

  return (
    <div className={`section__padding ${styles["apio__NFTGrid"]}`}>
      {!address ? console.log("Loading..") : !currentNFTData ? <p>Loading...</p> 
        : <CollectionHeader address={address} isConnected={isConnected} signer={signer}/>
      }
      <div className={isConnected ? styles["apio__NFTGrid--isConnected"] : styles["apio__NFTGrid--toConnect"]}>
        <p>You need to connect your wallet to view NFTs</p>
        <button onClick={connect}>Connect your wallet</button>
      </div>
      <div className={styles["apio__NFTGrid--grid_container"]}>
        <div className={isConnected ? styles["apio__NFTGrid--grid"] : styles["apio__NFTGrid--notConnected"]} onScroll={handleGridScroll}>
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
    </div>
  )
}