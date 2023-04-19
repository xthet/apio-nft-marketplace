import Image from "next/image"
import { truncateStr } from "../../utils/truncateStr"
import { ethers, BigNumber } from "ethers"
import { useState, useEffect } from "react"
import { GET_FLOOR_NFT, GET_COLLECTION } from "../../constants/subGraphQueries"
import { useQuery, ApolloClient, InMemoryCache, gql } from "@apollo/client"
import getABI from "../../utils/getABI"
import styles from "./CollectionHeader.module.css"

export default function CollectionHeader({ name, address, isConnected, signer })
{
  const [collectCollection, setCollectCollection] = useState(false)
  const [collectionName, setCollectionName] = useState(undefined)
  const [loaded, setLoaded] = useState(false)
  const [tokenName, setTokenName] = useState("")
  const [tokenDescription, setTokenDescription] = useState("")   
  const [imageURI, setImageURI] = useState("")
  const [collectionImageURI, setCollectionImageURI] = useState("")  
  const [floorPrice, setFloorPrice] = useState(BigNumber.from("0"))
  const [tknSupply, setTknSupply] = useState("")
  const [listedCount, setListedCount] = useState("")

  async function getFloorNFT(nftAddress)
  {
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })

    const collectionData = await client
      .query({
        query: GET_COLLECTION,
        variables: { activeCollection: nftAddress },
      })
      .then(async (data) => {
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })

    setCollectionName(collectionData.data.collectionFound.name)
    setFloorPrice(collectionData.data.collectionFound.floorPrice)
    const tokenURI = collectionData.data.collectionFound.tokenURI
    const imgURI = await fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")).then(res=>res.json()).then(data=>data.image.replace("ipfs://", "https://ipfs.io/ipfs/"))
    setImageURI(imgURI)

    const ERC721Supply = await fetch(`https://api-sepolia.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`).then(res=>res.json()).then(data=>data.result)
    ERC721Supply == "0" ? setTknSupply("Inf") : setTknSupply(ERC721Supply)
    setListedCount(collectionData.data.collectionFound.listedCount)
  }

  useEffect(()=>{
    isConnected && address && getFloorNFT(address)
  }, [isConnected, loaded])



  return (
    <div className={styles["apio__collectionHeader"]}>
      <div className={styles["apio__collectionHeader--image_container"]}>
        <div className={styles["apio__collectionHeader--image_container--image_frame"]}>
          <div className={styles["apio__collectionHeader--image_container--image"]}>
            {imageURI && <div className={styles["nimg"]}><Image onLoad={()=>{setLoaded(true)}} loader={()=>imageURI} src={imageURI} alt="collectionimg" layout="fill" objectFit="cover"/></div>}
          </div>
          <div className={styles["apio__collectionHeader--image_container--separator"]}></div>
          <div className={styles["apio__collectionHeader--image_container--text"]}>
            <h3>{collectionName}</h3>
            <a href={`https://sepolia.etherscan.io/token/${address}`} target="_blank" rel="noopener noreferrer">
              <p>@{truncateStr(address || "", 12)}</p>
            </a>
          </div>
        </div>
      </div>

      <div className={styles["apio__collectionHeader--details_container"]}>
        <div className={styles["apio__collectionHeader--details_container--details_frame"]}>
          <h1>{name}</h1>
          <div className={styles["apio__collectionHeader--details_container--stat_boxes"]}>
            <div className={styles["apio__collectionHeader--details_container--stat_boxes--stat_box"]}>
              <h3>FLOOR PRICE:</h3>
              <h3>{ethers.utils.formatUnits(floorPrice, "ether")} rETH</h3>
            </div>
            <div className={styles["apio__collectionHeader--details_container--stat_boxes--stat_box"]}>
              <h3>LISTED:</h3>
              <h3>{listedCount == "0" ? "1" : listedCount}</h3>
            </div>
            {/* <div className={styles["apio__collectionHeader--details_container--stat_boxes--stat_box"]}>
              <h3>OWNERS:</h3>
              <h3>300</h3>
            </div> */}
            <div className={styles["apio__collectionHeader--details_container--stat_boxes--stat_box"]}>
              <h3>TOTAL SUPPLY:</h3>
              <h3>{tknSupply}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}