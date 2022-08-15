import styles from "./Notice.module.css"
import Marquee from "react-fast-marquee"

export default function Notice()
{
  return (
    <div className={styles["apio__notice"]}>
      <div className={styles["apio__notice--border"]}>
        <Marquee gradient={false} speed={30}>
          <p className={styles["apio__notice--text"]}>
            Notice!!⏰: This is a demo project on the Ethereum Rinkeby Test Network. 
            Pls change your wallet network to Rinkeby for the connected account...
          </p>
        </Marquee>
      </div>
    </div>
  )
}