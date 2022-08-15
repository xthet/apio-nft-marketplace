import styles from "./Collections.module.css"
import { GET_DROP_COLLECTIONS, GET_FLOOR_NFT } from "../../constants/subGraphQueries"
import { CollectionCard } from "../../components/exportComps"
import { BigNumber, ethers } from "ethers"
import { useQuery, ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { useCallback, useEffect, useState } from "react"
import { useNotification } from "../../utils/NotificationProvider"
import useTokenURI from "../../utils/useTokenURI"

export default function Collections({ connect, isConnected, chainId, signer, type })
{
  const [cardPrice, setCardPrice] = useState(ethers.BigNumber.from("0"))
  const [cardTokenId, setCardTokenId] = useState("0")
  const [collections, setCollections] = useState([])
  const [currentOffset, setCurrentOffset] = useState(0)
  const { tokenName, tokenDescription, imageURI, collectionImageURI, getTokenURI } = useTokenURI()

  const dispatch = useNotification()

  // const { loading: collLoading, error: collError, data: collections } = useQuery(GET_COLLECTIONS)
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
    cache: new InMemoryCache(),
  })

  async function getCollections()
  {
    const foundCollections = await client
      .query({
        query: gql(GET_DROP_COLLECTIONS),
        variables: { offset: currentOffset },
      })
      .then(async (data) => {
        console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    setCollections(prev => [...prev, ...foundCollections.data.collectionFounds])
  }

  async function getFloorNFT(nftAddress)
  {
    const [floorPrice, floorTokenId] = await client
      .query({
        query: gql(GET_FLOOR_NFT),
        variables: { activeNFTAddress: nftAddress },
      })
      .then(async (data) => {
        // console.log("Subgraph data: ", data)
        const floorPrice = await data.data.activeItems[0].price
        const floorTokenId = await data.data.activeItems[0].tokenId
        return [floorPrice, floorTokenId]
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })

    setCardPrice(floorPrice)
    setCardTokenId(floorTokenId)
    // console.log(floorPrice, floorTokenId)
    // return [floorPrice, floorTokenId]
  }

  function handleGridScroll({ currentTarget })
  {
    if(currentTarget.clientHeight + currentTarget.scrollTop + 1 >= currentTarget.scrollHeight)
    {
      setCurrentOffset(prev => prev + 5)
      console.log("here")
    }
  }

  useEffect(()=>{
    isConnected && getCollections()
  },[isConnected, currentOffset])

  return (
    <div className={`section__padding ${styles["apio__collections"]}`} id={type == "home" ? "drops" : "collections"}>
      {
        type === "home" 
          ? 
          <div className={styles["apio__collections--heading"]}>
            <h3>NFT Marketplace</h3>
            <h1>Hot Drops 🔥</h1>
          </div>
          : 
          <div className={styles["apio__collections--explore_heading"]}>
            <h1>Explore Collections</h1>
          </div>
      }
      <div className={isConnected ? styles["apio__collections--isConnected"] : styles["apio__collections--toConnect"]}>
        <p>You need to connect your wallet to view NFTs</p>
        <button onClick={connect}>Connect your wallet</button>
      </div>

      <div className={styles["apio__collections--grid_container"]} onScroll={handleGridScroll}>
        <div className={isConnected ? styles["apio__collections--grid"] : styles["apio__collections--notConnected"]}>
          {collections.length == 0 || !collections ? <p> </p> :
            collections.map((collection, index)=>{
              const { name, symbol, nftAddress } = collection
              getFloorNFT(nftAddress)
              {/* console.log(nftAddress, cardPrice, cardTokenId) */}
              getTokenURI(nftAddress, cardTokenId)
              return (
                <CollectionCard
                  key={index}
                  imageURI={imageURI}
                  name={name}
                  address={nftAddress}
                  floorPrice={cardPrice}
                />
              )
            })}
        </div>
      </div>
    </div>
  )
}