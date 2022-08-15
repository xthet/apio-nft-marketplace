import styles from "./SellNFTs.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"


export default function SellNFTs()
{
  return (
    <div className={`section__padding ${styles["apio__sellNFTs"]}`} id="sellnfts">
      <div className={styles["apio__sellNFTs--heading"]}>
        <h3>How to be a vendor</h3>
        <h1>Sell your NFTs</h1>
      </div>
      <div className={styles["apio__sellNFTs--CTA"]}>
        <FontAwesomeIcon icon="fa-solid fa-file-contract" className={styles["apio__sellNFTs--CTA--icon"]}/>
        <p>Set up your NFTs with their details and list them for a fixed price on the marketplace. Update and Remove your NFTs as you wish. Also track and withdraw your earnings.</p>
        <Link href="/sell-nft"><div><button type="button"><a>Sell Now!!</a></button></div></Link>
      </div>
    </div>
  )
}