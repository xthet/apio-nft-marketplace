import styles from "./CollectionCard.module.css"
import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { ethers } from "ethers"
import { truncateStr } from "../../utils/truncateStr"

export default function CollectionCard({ name, address, floorPrice, imageURI })
{
  const [collectCollection, setCollectCollection] = useState(false)

  return (
    <div className={styles["apio__collectionCard"]} onMouseEnter={()=>{setCollectCollection(true)}} onMouseLeave={()=>{setCollectCollection(false)}}>
      <div className={styles["apio__collectionCard--image"]}>
        <div className={styles["nimg"]}><Image loader={()=>imageURI} src={imageURI} alt="NFT" layout="fill" objectFit="cover"/></div>
      </div>
      <div className={styles["apio__collectionCard--text"]}>
        <h3 className={styles["apio__collectionCard--text--name"]}>{`${name}`}</h3>
        <a href=""><p className={styles["apio__collectionCard--creator"]}>@{truncateStr(address || "", 12)}</p></a>
        {/* <p className={styles["apio__collectionCard--floor_price"]}>Floor Price</p> */}
        <div className={styles["apio__collectionCard--text--price"]}>
          <div className={styles["apio__collectionCard--floor_price"]}>
            <p>Floor Price: {ethers.utils.formatUnits(floorPrice, "ether")} rETH</p>
          </div>
          {/* <h3>{ethers.utils.formatUnits(floorPrice, "ether")} rETH</h3> */}
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