import { useEffect, useState } from "react"
import { NFTCard } from "../../components/exportComps"
import { GET_COLLECTION_NAME, GET_USER_LISTINGS } from "../../constants/subGraphQueries"
import { useQuery, ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { useRouter } from "next/router"
import styles from "./UpdateListing.module.css"


export default function UpdateListing({ connect, isConnected, chainId, signer, account })
{
  const [activeUserNFTs, setActiveUserNFTs] = useState([])
  // const [currentCollectionName, setCurrentCollectionName] = useState(null)
  const [currentOffset, setCurrentOffset] = useState(0)
  const router = useRouter()
  

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
    cache: new InMemoryCache(),
  })


  async function getUserNFTData()
  {
    const activeAccount = await account
    console.log(account)
    console.log(currentOffset)
    const userNFTs = await client
      .query({
        query: gql(GET_USER_LISTINGS),
        variables: { activeAccount: activeAccount, offset: currentOffset },
      })
      .then(async (data) => {
        // console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    // console.log(currentOffset)
    userNFTs && setActiveUserNFTs(prevUserNFTs => [...prevUserNFTs, ...userNFTs.data.activeItems])
  }

  function handleGridScroll({ currentTarget })
  {
    if(currentTarget.clientHeight + currentTarget.scrollTop + 1 >= currentTarget.scrollHeight)
    {
      setCurrentOffset(prev => prev + 5)
      // console.log("here")
    }
  }


  useEffect(()=>
  {
    async function runUI()
    {
      await getUserNFTData()
      // console.log("there")
    }
    isConnected && runUI()
  }, [isConnected, account, currentOffset])

  return (
    <div className={`section__padding ${styles["apio__updateListing"]}`}>
      <div className={styles["apio__updateListing--modal--heading"]}>
        <h1>Your Listings</h1>
      </div>
      <div className={isConnected ? styles["apio__updateListing--isConnected"] : styles["apio__updateListing--toConnect"]}>
        <p>You need to connect your wallet to view NFTs</p>
        <button onClick={connect}>Connect your wallet</button>
      </div>
      <div className={styles["apio__updateListing--modal--listings--grid_container"]}>
        <div className={isConnected ? styles["apio__updateListing--grid"] : styles["apio__updateListing--notConnected"]} onScroll={handleGridScroll}>
          {!activeUserNFTs ? <p>Loading...</p> : activeUserNFTs.length == 0 ? <h3>You have no active listings.</h3> : activeUserNFTs.map((NFT, index)=>{
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
                type={"userListing"}
                isConnected={isConnected}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}