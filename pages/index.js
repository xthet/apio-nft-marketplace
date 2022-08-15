import Head from "next/head"
import { Brands, Navbar, NFTCard, Notice } from "../components/exportComps"
import { Header, Footer, SellNFTs, Collections } from "../containers/exportConts"
import useConnection from "../utils/useConnection"
import styles from "../styles/Home.module.css"


export default function Home() {
  const { hasMetamask, isConnected, chainId, signer, account, connect } = useConnection()



  return (
    <div className="App gradient__bg">
      <Head>
        <title>apio - NFT Markeplace</title>
        <meta name="apio-project" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
    
      <div>
        <Navbar connect={connect} isConnected={isConnected} account={account} signer={signer}/>
        <Notice />
        <Header connect={connect} isConnected={isConnected} account={account} signer={signer}/>
      </div>

      <Brands />
      <Collections connect={connect} isConnected={isConnected} chainId={chainId} signer={signer} type="home"/>
      <SellNFTs />
      <Footer />
    </div>
  )
}
