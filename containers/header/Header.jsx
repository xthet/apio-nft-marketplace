import Image from "next/image"
import Link from "next/link"
import styles from "./Header.module.css"
import { ethers, BigNumber } from "ethers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { truncateStr } from "../../utils/truncateStr"
import { useQuery, ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { GET_DROP_COLLECTIONS, GET_FLOOR_NFT, GET_FOUR_COLLECTIONS, GET_REAL_COLLECTIONS } from "../../constants/subGraphQueries"
import { useEffect, useState } from "react"
import getABI from "../../utils/getABI"



export default function Header({ connect, isConnected, account, signer })
{
  // const { tokenName, tokenDescription, imageURI, collectionImageURI, getTokenURI } = useTokenURI()
  const[name, setName] = useState("")
  const[nftAddress, setNftAddress] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [tokenName, setTokenName] = useState("")
  const [tokenDescription, setTokenDescription] = useState("")   
  const [imageURI, setImageURI] = useState("")
  const [collectionImageURI, setCollectionImageURI] = useState("") 
  const [collections, setCollections] = useState([])

  
  // const { loading: collLoading, error: collError, data: collections } = useQuery(GET_COLLECTIONS)
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
        // console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    
    setCollections(homeCollections.data.collectionFounds)
  }


  useEffect(()=>{
    async function runHeader()
    {
      if(collections.length){ 
        const rand = Math.floor(Math.random() * collections.length)
        const { name, symbol, nftAddress, tokenURI } = collections[rand]
        const nftImg = await fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")).then(res=>res.json()).then(data=>data.image.replace("ipfs://", "https://ipfs.io/ipfs/"))
        setNftAddress(nftAddress)
        setName(name)
        setCollectionImageURI(nftImg)
      }
    }

    collections && runHeader()
  },[isConnected, collections, loaded])

  useEffect(()=>{
    async function runQueries()
    {
      await getHomeCollections()
    }

    runQueries()
  },[isConnected])


  function HeaderImage()
  {
    return (
      <div className={styles["apio__header--image_container--image_frame"]}>
        <div className={styles["apio__header--image_container--image"]}>
          <div className={styles["nimg"]}>
            {<Image onLoad={()=>{setLoaded(true)}} 
              loader={()=>collectionImageURI} src={collectionImageURI} 
              alt="headerNFT" layout="fill" objectFit="cover"/>}
          </div>
        </div>
        <div className={styles["apio__header--image_container--separator"]}></div>
        <div className={styles["apio__header--image_container--text"]}>
          <h3>{name}</h3>
          <a href={`https://sepolia.etherscan.io/token/${nftAddress}`} target="_blank" rel="noopener noreferrer">
            <p>@{truncateStr(nftAddress || "", 12)}</p>
          </a>
        </div>
      </div>
    )
  }


  async function getTokenURI(nftAddress, tokenId, collectionType = false)
  {
    if (typeof window.ethereum !== "undefined")
    {
      try{
        const nftABI = await getABI(nftAddress)
        const NFTContract = new ethers.Contract(nftAddress, nftABI, signer)
        const tokenURI = await NFTContract.tokenURI(tokenId)
        collectionType ? await mutateURI(tokenURI, true) : await mutateURI(tokenURI)
      }catch(e){console.log(e)}
    }

    async function mutateURI(tokenURI, collectionType = false)
    {
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/") // switching to https
      const tokenURIResponse = await (await fetch(requestURL)).json() 
      const imageURI = tokenURIResponse.image
      const imageToURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      !collectionType ? setImageURI(imageToURL) : setCollectionImageURI(imageToURL)
      // console.log(imageURI)
      setTokenName(tokenURIResponse.name)
      setTokenDescription(tokenURIResponse.description)
    }
  }

  return (
    <div className={`section__padding ${styles["apio__header"]}`} id="header">
      <div className={styles["apio__header--heading"]}>
        <h1>Discover, collect and sell rare NFTs</h1>
        <p>
          Apio is the NFT Marketplace for you. Authentic and truly unique digital creations. 
          Signed and issued by the creators. 
          A fully decentralized platform made possible by blockchain technology
        </p>
        <div className={styles["apio__header--buttons"]}>
          <Link href="/explore"><div><button className={styles["apio__header--explore_btn"]}>Explore</button></div></Link>
          <Link href="/sell-nft"><div><button className={styles["apio__header--sellNFT_btn"]}>Sell NFTs</button></div></Link>
        </div>
        <div className={`${isConnected ? styles["apio__header--connected"] : ""} ${styles["apio__header--connect"]}`} 
          onClick={isConnected ? null : connect}>

          <FontAwesomeIcon icon="fa-solid fa-wallet" className={styles["apio__header--wallet_icon"]}/>
          <p>{isConnected ? truncateStr(account || "", 12) : "Connect your wallet"}</p>

        </div>
      </div>
      {
        !collections 
          ? <p>Loading</p> 
          : 
          <div className={styles["apio__header--image_container"]}>
            <HeaderImage />
          </div>
        
      }
    </div>
  )
}