import Image from "next/image"
import { truncateStr } from "../../utils/truncateStr"
import { ethers } from "ethers"
import styles from "./CollectionHeader.module.css"

export default function CollectionHeader({ name, address, floorPrice, imageURI })
{
  return (
    <div className={styles["apio__collectionHeader"]}>
      <div className={styles["apio__collectionHeader--image_container"]}>
        <div className={styles["apio__collectionHeader--image_container--image_frame"]}>
          <div className={styles["apio__collectionHeader--image_container--image"]}>
            <div className={styles["nimg"]}><Image loader={()=>imageURI} src={imageURI} alt="collectionimg" layout="fill" objectFit="cover"/></div>
          </div>
          <div className={styles["apio__collectionHeader--image_container--separator"]}></div>
          <div className={styles["apio__collectionHeader--image_container--text"]}>
            <h3>{name}</h3>
            <a href={`https://rinkeby.etherscan.io/token/${address}`} target="_blank" rel="noopener noreferrer">
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
            {/* <div className={styles["apio__collectionHeader--details_container--stat_boxes--stat_box"]}>
              <h3>LISTED:</h3>
              <h3>30</h3>
            </div>
            <div className={styles["apio__collectionHeader--details_container--stat_boxes--stat_box"]}>
              <h3>OWNERS:</h3>
              <h3>300</h3>
            </div>
            <div className={styles["apio__collectionHeader--details_container--stat_boxes--stat_box"]}>
              <h3>TOTAL SUPPLY:</h3>
              <h3>3000</h3>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}