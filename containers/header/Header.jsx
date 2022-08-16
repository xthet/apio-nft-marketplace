import Image from "next/image"
import Link from "next/link"
import styles from "./Header.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { truncateStr } from "../../utils/truncateStr"
import { useQuery, ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { GET_COLLECTIONS, GET_FLOOR_NFT } from "../../constants/subGraphQueries"
import useTokenURI from "../../utils/useTokenURI"


export default function Header({ connect, isConnected, account, signer })
{
  const { tokenName, tokenDescription, imageURI, collectionImageURI, getTokenURI } = useTokenURI()
  
  const { loading: collLoading, error: collError, data: collections } = useQuery(GET_COLLECTIONS)

  function HeaderImage()
  {
    console.log(collections)
    const rand = Math.floor(Math.random() * collections.collectionFounds.length)
    const { name, smybol, nftAddress } = collections.collectionFounds[rand]
    getTokenURI(nftAddress, "0", true)
    return (
      <div className={styles["apio__header--image_container--image_frame"]}>
        <div className={styles["apio__header--image_container--image"]}>
          <div className={styles["nimg"]}>{<Image loader={()=>collectionImageURI} src={collectionImageURI} alt="headerNFT" layout="fill" objectFit="cover"/>}</div>
        </div>
        <div className={styles["apio__header--image_container--separator"]}></div>
        <div className={styles["apio__header--image_container--text"]}>
          <h3>{name}</h3>
          <p>@{truncateStr(nftAddress || "", 12)}</p>
        </div>
      </div>
    )
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
          <a href={`https://rinkeby.etherscan.io/token/${address}`} target="_blank" rel="noopener noreferrer">
            <p>{isConnected ? truncateStr(account || "", 12) : "Connect your wallet"}</p>
          </a>
        </div>
      </div>
      {
        !isConnected || collLoading || collError || !collections 
          ? <p>Loading</p> 
          : 
          <div className={styles["apio__header--image_container"]}>
            <HeaderImage />
          </div>
        
      }
    </div>
  )
}