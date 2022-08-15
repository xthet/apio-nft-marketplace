import Head from "next/head"
import useConnection from "../utils/useConnection"
import { Brands, Navbar, NFTCard, Notice } from "../components/exportComps"
import { Header, Footer, Marketplace, SellNFTs, NFTVendor, UpdateListing } from "../containers/exportConts"
import styles from "../styles/Home.module.css"

export default function Explore() {
  const { hasMetamask, isConnected, chainId, signer, account, connect } = useConnection()

  return (
    <div className="App gradient__bg">
      <Head>
        <title>apio - Sell NFTs</title>
        <meta name="apio-project" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
    
      <div>
        <Navbar connect={connect} isConnected={isConnected} signer={signer} account={account}/>
        <Notice />
      </div>
      <NFTVendor connect={connect} isConnected={isConnected} chainId={chainId} signer={signer} account={account}/>
      <UpdateListing connect={connect} isConnected={isConnected} chainId={chainId} signer={signer} account={account}/>
      <Footer />
    </div>
  )
}
