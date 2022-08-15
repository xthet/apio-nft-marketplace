import styles from "./Footer.module.css"
import Image from "next/image"
import logo from "../../assets/logo.svg"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Footer()
{
  return (
    <div className={`section__padding--footer ${styles["apio__footer_copyright--container"]}`} id="contact">
      <div className={styles["apio__footer"]}>
        <div className={styles["apio__footer--about"]}>
          <Link href="/#header">
            <div className={styles["apio__footer--about--logo"]}>
              <div className={styles["nimg"]}><Image src={logo} alt="logo"/></div>
              <h1>apio</h1>
            </div>
          </Link>
          <div className={styles["apio__footer--about--text"]}>
            <p>
              Apio is the NFT Marketplace for you. Authentic and truly unique digital creations.
              Signed and issued by the creators.
              A fully decentralized platform made possible by blockchain technology
            </p>
          </div>
          <div className={styles["apio__footer--about--social"]}>
            <a href="https://twitter.com/xapski2671" target="_blank" rel="noopener noreferrer">
              <div className={styles["apio__footer--about--social--box"]}>
                <FontAwesomeIcon icon="fa-brands fa-twitter" className={styles["apio__footer--about--social-twitter"]}/>
              </div>
            </a>
            <a href="https://github.com/xapski2671" target="_blank" rel="noopener noreferrer">
              <div className={styles["apio__footer--about--social--box"]}>
                <FontAwesomeIcon icon="fa-brands fa-github" className={styles["apio__footer--about--social-github"]}/>
              </div>
            </a>
            <a href="mailto:xapski2671@gmail.com?subject=Apio Marketplace">
              <div className={styles["apio__footer--about--social--box"]} >
                <FontAwesomeIcon icon="fa-solid fa-envelope" className={styles["apio__footer--about--social-email"]}/>
              </div>
            </a>
          </div>
        </div>
        <div className={styles["apio__footer--menu_container"]}>
          <div className={styles["apio__footer--menu_container--marketplace"]}>
            <p>Marketplace</p>
            <ul>
              <li><Link href="/#drops">Drops</Link></li>
              <li><Link href="/explore">Explore</Link></li>
              <li><Link href="sell-nft">Sell NFTs</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </div>
          <div className={styles["apio__footer--menu_container--company"]}>
            <p>Company</p>
            <ul>
              <li><Link href="/#contact">About Us</Link></li>
              <li><a href="https://github.com/xapski2671" target="_blank" rel="noopener noreferrer">Careers</a></li>
              <li><a href="mailto:xapski2671@gmail.com?subject=Apio Marketplace">Support</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles["apio__copyright"]}>
        <p>© 2022 Apio Project. All rights reserved.</p>
      </div>
    </div>
  )
}