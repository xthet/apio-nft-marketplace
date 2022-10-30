import Head from "next/head"
import useConnection from "../../utils/useConnection"
import { Navbar, Notice } from "../../components/exportComps"
import { Footer, Collections } from "../../containers/exportConts"
import styles from "../../styles/Home.module.css"


export default function Explore() {
  const { hasMetamask, isConnected, chainId, signer, account, connect } = useConnection()


  return (
    <div className="App gradient__bg">
      <Head>
        <title>apio - Explore</title>
        <meta name="apio-project" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
    
      <div>
        <Navbar connect={connect} isConnected={isConnected} account={account} signer={signer}/>
        {/* <Notice /> */}
      </div>

      <Collections connect={connect} isConnected={isConnected} chainId={chainId} signer={signer} type="collections"/>
      <Footer />
    </div>
  )
}
