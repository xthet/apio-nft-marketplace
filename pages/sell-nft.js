import Head from "next/head"
import useConnection from "../utils/useConnection"
import { Brands, Navbar, NFTCard, Notice } from "../components/exportComps"
import { Header, Footer, Marketplace, SellNFTs, NFTVendor, UpdateListing } from "../containers/exportConts"
import styles from "../styles/Home.module.css"
import { useContext } from "react"
import { ConnectionContext } from "../contexts/connection"

export default function Explore() {
  const { isConnected, signer, account, provider, connect, chainId } = useContext(ConnectionContext)

  return (
    <div className="App gradient__bg">
      <Head>
        <title>apio - Sell NFTs</title>
        <meta name="apio-project" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
    
      <div>
        <Navbar connect={connect} isConnected={isConnected} signer={signer} account={account}/>
        {/* <Notice /> */}
      </div>
      <NFTVendor connect={connect} isConnected={isConnected} chainId={chainId} signer={signer} account={account}/>
      <UpdateListing connect={connect} isConnected={isConnected} chainId={chainId} signer={signer} account={account}/>
      <Footer />
    </div>
  )
}
