import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { ethers } from "ethers"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CollectionCard } from "../../components/exportComps"
import { GET_DROP_COLLECTIONS, GET_FOUR_COLLECTIONS, GET_REAL_COLLECTIONS } from "../../constants/subGraphQueries"
import { useNotification } from "../../utils/NotificationProvider"
import styles from "./Collections.module.css"
import { useRouter } from "next/router"


export default function Collections({ connect, isConnected, chainId, signer, type })
{ 
  const router = useRouter()
  const [cardPrice, setCardPrice] = useState(ethers.BigNumber.from("0"))
  const [cardTokenId, setCardTokenId] = useState("0")
  const [collections, setCollections] = useState([])
  const [currentOffset, setCurrentOffset] = useState(0)
  const dispatch = useNotification()

  
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
    cache: new InMemoryCache(),
  })

  async function getHomeCollections()
  {
    const homeCollections = await client
      .query({
        query: GET_FOUR_COLLECTIONS
      })
      .then(async (data) => {
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    setCollections(homeCollections.data.collectionFounds)    
  }

  async function getCollections()
  {
    const foundCollections = await client
      .query({
        query: GET_DROP_COLLECTIONS,
        variables: { offset: currentOffset },
      })
      .then(async (data) => {
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    if(currentOffset == 0){
      setCollections(foundCollections.data.collectionFounds)
    }else{
      setCollections(prev => [...prev, ...foundCollections.data.collectionFounds])
    }
  }

  useEffect(()=>{
    async function runQueries()
    {
      if(type == "home"){
        await getHomeCollections()
      }
      else if (type == "collections")
      {
        await getCollections()
      }
    }

    runQueries()
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
      {/* <div className={isConnected ? styles["apio__collections--isConnected"] : styles["apio__collections--toConnect"]}>
        <p>You need to connect your wallet to view NFTs</p>
        <button onClick={connect}>Connect your wallet</button>
      </div> */}

      <div className={styles["apio__collections--grid_container"]}>
        {/* <div className={isConnected ? styles["apio__collections--grid"] : styles["apio__collections--notConnected"]}> */}
        <div className={styles["apio__collections--grid"]}>
          {!collections ? <p> </p> : type === "home" ?
            collections.slice(0,4).map((collection, index)=>{
              const { name, symbol, nftAddress } = collection
              return <CollectionCard key={index} address={nftAddress} name={name} isConnected={isConnected} signer={signer}/>
            })
            :
            collections.map((collection, index)=>{
              const { name, symbol, nftAddress } = collection
              return <CollectionCard key={index} address={nftAddress} name={name} isConnected={isConnected} signer={signer}/>
            })
          }
        </div>
      </div>

      {
        <div className={styles["apio__collections--see_more"]}>
          <div><button className={styles["apio__collections--see_more_btn"]}
            onClick={type == "home" ? ()=>{router.push("/explore")} : ()=>{setCurrentOffset(prev=>prev + 10)}}
          >
          See More...</button></div>
        </div>}
    </div>
  )
}