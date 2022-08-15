import Image from "next/image"
import { useState } from "react"
import { RiMenu3Line, RiCloseLine } from "react-icons/ri"
import Link from "next/link"
import logo from "../../assets/logo.svg"
import styles from "./Navbar.module.css"
import { truncateStr } from "../../utils/truncateStr"

function Menu()
{
  return <>
    <Link href="/#drops"><p><a>Drops</a></p></Link>
    <Link href="/explore"><p><a>Explore</a></p></Link>
    <Link href="/sell-nft"><p><a>Sell NFTs</a></p></Link>
    <Link href="/#contact"><p><a>Contact</a></p></Link>
  </>
}

export default function Navbar({ connect, isConnected, account })
{
  const [toggleMenu, setToggleMenu] = useState()

  return (
    <div className={styles["apio__navbar"]}>
      <div className={styles["apio__navbar--menu"]}>
        <Link href="/">
          <div className={styles["apio__navbar--menu_logo"]}>
            <div className={styles["nimg"]}><Image src={logo} alt="logo"/></div>
            <h1>apio</h1>
          </div>
        </Link>

        <div className={styles["apio__navbar--menu_container"]}>
          <Menu/>
        </div>
        {/* 
        <div className={styles["apio__navbar--menu_search"]}>
          <form action="" className={styles["apio__navbar--menu_search--form"]}>
            <input type="search" placeholder="Search..."/>
            <button type="submit">Search</button>
          </form>
        </div> */}

        <div className={styles["apio__navbar--menu_connect"]}>
          <button disabled={isConnected} type="button" onClick={connect}>{isConnected ? `${truncateStr(account || "", 8)}  | Connected` : "Connect Wallet"}</button>
        </div>

        {/* v mobile hamburger */}
        <div className={styles["apio__navbar--hamburger_menu"]}>
          {
            toggleMenu 
              ? (<RiCloseLine color="#fff" size={27} onClick={()=>{setToggleMenu(false)}}/>)
              : (<RiMenu3Line color="#fff" size={27} onClick={()=>{setToggleMenu(true)}}/>)
          }
          {toggleMenu
          && (
            <div className={`scale-up-center ${styles["apio__navbar--hamburger_menu--container"]}`}>
              <Menu />
              <div className={styles["apio__navbar--hamburger_menu--connect"]}>
                <button disabled={isConnected} type="button" onClick={connect}>{isConnected ? `${truncateStr(account || "", 8)}  | Connected` : "Connect Wallet"}</button>
              </div>
              {/* <div className={styles["apio__navbar--hamburger_menu_search"]}>
                <form action="" className={styles["apio__navbar--menu_search--form"]}>
                  <input type="search" placeholder="Search..."/>
                  <button type="submit">Search</button>
                </form>
              </div> */}
            </div>
          )
          }
        </div>
      </div>
    </div>
  )
}