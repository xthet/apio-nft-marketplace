import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BigNumber, ethers } from "ethers"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { GET_FLOOR_NFT } from "../../constants/subGraphQueries"
import getABI from "../../utils/getABI"
import { truncateStr } from "../../utils/truncateStr"
import styles from "./CollectionCard.module.css"

export default function CollectionCard({ name, address, isConnected, signer })
{
  const [collectCollection, setCollectCollection] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [floorPrice, setFloorPrice] = useState(BigNumber.from("0"))
  const [tokenName, setTokenName] = useState("")
  const [tokenDescription, setTokenDescription] = useState("")   
  const [imageURI, setImageURI] = useState("")
  const [collectionImageURI, setCollectionImageURI] = useState("") 

  async function getFloorNFT(nftAddress)
  {
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })

    const floorNFT = await client
      .query({
        query: gql(GET_FLOOR_NFT),
        variables: { activeNFTAddress: nftAddress },
      })
      .then(async (data) => {
        // console.log("Subgraph data: ", data)
        const floorPrice = await data.data.activeItems[0].price
        const floorTokenId = await data.data.activeItems[0].tokenId
        return { floorPrice: floorPrice, floorTokenId: floorTokenId }
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    
    if(floorNFT)
    {
      // console.log(`Floor NFT: ${floorNFT.floorPrice}`)
      getTokenURI(address, floorNFT.floorTokenId)
      setFloorPrice(floorNFT.floorPrice)
    }
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

  useEffect(()=>{
    isConnected && getFloorNFT(address)
    !imageURI && getFloorNFT(address)
  },[isConnected, imageURI, name, loaded])


  return (
    <div className={styles["apio__collectionCard"]} onMouseEnter={()=>{setCollectCollection(true)}} onMouseLeave={()=>{setCollectCollection(false)}}>
      <div className={styles["apio__collectionCard--image"]}>
        {/* {console.log(imageURI)} */}
        {imageURI && <div className={styles["nimg"]}><Image onLoad={()=>{setLoaded(true)}} loader={()=>imageURI} src={imageURI} alt="NFT" layout="fill" objectFit="cover"/></div>}
      </div>
      <div className={styles["apio__collectionCard--text"]}>
        <h3 className={styles["apio__collectionCard--text--name"]}>{`${name}` || <p></p>} </h3>
        <a href={`https://goerli.etherscan.io/token/${address}`} target="_blank" rel="noopener noreferrer">
          <p className={styles["apio__collectionCard--creator"]}>@{truncateStr(address || "", 12)}</p>
        </a>
        <div className={styles["apio__collectionCard--text--price"]}>
          <div className={styles["apio__collectionCard--floor_price"]}>
            <p>Floor Price: {ethers.utils.formatUnits(floorPrice, "ether") || "0.0"} rETH</p>
          </div>
          <p>
            <FontAwesomeIcon icon="fa-brands fa-ethereum" className={styles["apio__collectionCard--eth_icon"]}/>
          </p>
        </div>
        <Link href={`/explore/${address}`}>
          <div className={collectCollection ? styles["apio__collectionCard--collectCollection"] : styles["hide_collectCollection"]}>
            <button>Collect Now!</button>
          </div>
        </Link>
      </div>
    </div>
  )
}