import Image from "next/image"
import styles from "./Brands.module.css"
import { coinbase, ethereum, ipfs, metamask, walletconnect } from "./imports"


export default function Brands()
{
  return (
    <div className={`section__padding ${styles["apio__brands"]}`}>
      <div>
        <div className={styles["nimg"]}><Image src={coinbase} alt="coinbase"/></div>
      </div>
      <div>
        <div className={styles["nimg"]}><Image src={ethereum} alt="ethereum"/></div>
      </div>
      <div>
        <div className={styles["nimg"]}><Image src={ipfs} alt="ipfs"/></div>
      </div>
      <div>
        <div className={styles["nimg"]}><Image src={metamask} alt="metamsk"/></div>
      </div>
      <div>
        <div className={styles["nimg"]}><Image src={walletconnect} alt="walletconnect"/></div>
      </div>
    </div>
  )
}