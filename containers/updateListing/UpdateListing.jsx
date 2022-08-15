import styles from "./UpdateListing.module.css"
import { useEffect, useState } from "react"
import { NFTCard } from "../../components/exportComps"
import { GET_COLLECTION_NAME, GET_USER_LISTINGS } from "../../constants/subGraphQueries"
import { useQuery, ApolloClient, InMemoryCache, gql } from "@apollo/client"
import useTokenURI from "../../utils/useTokenURI"

export default function UpdateListing({ connect, isConnected, chainId, signer, account })
{
  const [activeUserNFTs, setActiveUserNFTs] = useState([])
  const [currentCollectionName, setCurrentCollectionName] = useState(null)
  const [currentOffset, setCurrentOffset] = useState(0)
  const { tokenName, tokenDescription, imageURI, collectionImageURI, getTokenURI } = useTokenURI()
  

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
    cache: new InMemoryCache(),
  })


  async function getUserNFTData()
  {
    const activeAccount = account
    console.log(account)
    console.log(currentOffset)
    const userNFTs = await client
      .query({
        query: gql(GET_USER_LISTINGS),
        variables: { activeAccount: activeAccount, offset: currentOffset },
      })
      .then(async (data) => {
        console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    console.log(currentOffset)
    userNFTs && setActiveUserNFTs(prevUserNFTs => [...prevUserNFTs, ...userNFTs.data.activeItems])
  }

  async function getCollectionName(activeNFTAddress)
  {
    const collectionName = await client
      .query({
        query: gql(GET_COLLECTION_NAME),
        variables: { activeNFTAddress: activeNFTAddress },
      })
      .then(async (data) => {
        // console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    
    collectionName && setCurrentCollectionName(collectionName.data.collectionFounds[0].name)
  }

  function handleGridScroll({ currentTarget })
  {
    if(currentTarget.clientHeight + currentTarget.scrollTop + 1 >= currentTarget.scrollHeight)
    {
      setCurrentOffset(prev => prev + 5)
      console.log("here")
    }
  }

  useEffect(()=>
  {
    async function runUI()
    {
      await getUserNFTData()
      console.log("there")
    }
    isConnected && runUI()
  }, [isConnected, account, currentOffset])

  return (
    <div className={`section__padding ${styles["apio__updateListing"]}`}>
      <div className={styles["apio__updateListing--modal--heading"]}>
        <h1>Your Listings</h1>
      </div>
      <div className={styles["apio__updateListing--modal--listings--grid_container"]}>
        <div className={isConnected ? styles["apio__updateListing--isConnected"] : styles["apio__updateListing--toConnect"]}>
          <p>You need to connect your wallet to view NFTs</p>
          <button onClick={connect}>Connect your wallet</button>
        </div>
        <div className={isConnected ? styles["apio__updateListing--grid"] : styles["apio__updateListing--notConnected"]} onScroll={handleGridScroll}>
          {!activeUserNFTs ? <p>Loading...</p> : activeUserNFTs.length == 0 ? <h3>You have no active listings.</h3> : activeUserNFTs.map((NFT, index)=>{
            const { price, tokenId, nftAddress, seller } = NFT
            getTokenURI(nftAddress, tokenId)
            {/* getTokenURI(nftAddress, "0", true) */}
            getCollectionName(nftAddress)
            return (
              <NFTCard
                key={index}
                price={price}
                nftAddress={nftAddress}
                name={tokenName}
                description={tokenDescription}
                imageURI={imageURI}
                tokenId={tokenId}
                seller={seller}
                account={account}
                chainId={chainId}
                signer={signer}
                type={"userListing"}
                collectionName={currentCollectionName}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}