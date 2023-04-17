import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { ethers } from "ethers"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CollectionCard } from "../../components/exportComps"
import { GET_DROP_COLLECTIONS, GET_FOUR_COLLECTIONS, GET_REAL_COLLECTIONS } from "../../constants/subGraphQueries"
import { useNotification } from "../../utils/NotificationProvider"
import styles from "./Collections.module.css"


export default function Collections({ connect, isConnected, chainId, signer, type })
{
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
        query: gql(GET_FOUR_COLLECTIONS)
      })
      .then(async (data) => {
        
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    
    

    async function getRealCollections(nftAddress)
    {
      const realCollections = await client
        .query({
          query: gql(GET_REAL_COLLECTIONS),
          variables: { nftAddress: nftAddress },
        })
        .then(async (data) => {
          
          return data
        })
        .catch((err) => {
          console.log("Error fetching data: ", err)
        })
      return realCollections.data.activeItems
    }

    const readyCollections = homeCollections.data.collectionFounds
    
    const mutatedCollections = readyCollections.map(async collection => {
      const realCollection = await getRealCollections(collection.nftAddress)
      
      if(realCollection.length > 0){
        setCollections(prev => [...prev, collection])
      
      }
    })
    
  }

  async function getCollections()
  {
    let collArray = []
    const foundCollections = await client
      .query({
        query: gql(GET_DROP_COLLECTIONS),
        variables: { offset: currentOffset },
      })
      .then(async (data) => {
        
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    
    collArray = [...collArray, ...foundCollections.data.collectionFounds]

    async function getRealCollections(nftAddress)
    {
      const realCollections = await client
        .query({
          query: gql(GET_REAL_COLLECTIONS),
          variables: { nftAddress: nftAddress },
        })
        .then(async (data) => {
          console.log("Subgraph data: ", data)
          return data
        })
        .catch((err) => {
          console.log("Error fetching data: ", err)
        })

      return realCollections.data.activeItems
    }

    const readyCollections = collArray

    console.log(readyCollections)
    const mutatedCollections = readyCollections.map(async collection => {
      const realCollection = await getRealCollections(collection.nftAddress)
      
      if(realCollection.length > 0){
        setCollections(prev => [...prev, collection])
      }
    })
  }

  function handleGridScroll({ currentTarget })
  {
    if(currentTarget.clientHeight + currentTarget.scrollTop + 1 >= currentTarget.scrollHeight)
    {
      setCurrentOffset(prev => prev + 5)
      
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

    isConnected && runQueries()
  },[isConnected])

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

      <div className={styles["apio__collections--grid_container"]}>
        <div className={isConnected ? styles["apio__collections--grid"] : styles["apio__collections--notConnected"]} onScroll={handleGridScroll}>
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

      {type == "home" && isConnected &&
      <div className={styles["apio__collections--see_more"]}>
        <Link href="/explore"><div><button className={styles["apio__collections--see_more_btn"]}>See More...</button></div></Link>
      </div>}
    </div>
  )
}