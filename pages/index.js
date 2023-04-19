import Head from "next/head"
import { Brands, Navbar } from "../components/exportComps"
import { Collections, Footer, Header, SellNFTs } from "../containers/exportConts"
import { ConnectionContext } from "../contexts/connection"
import { useContext } from "react"


export default function Home() {
  const { isConnected, signer, account, provider, connect, chainId } = useContext(ConnectionContext)

  return (
    <div className="App gradient__bg">
      <Head>
        <title>apio - NFT Markeplace</title>
        <meta name="apio-project" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
    
      <div>
        <Navbar connect={connect} isConnected={isConnected} account={account} signer={signer}/>
        {/* <Notice /> */}
        <Header connect={connect} isConnected={isConnected} account={account} signer={signer}/>
      </div>

      <Brands />
      <Collections connect={connect} isConnected={isConnected} chainId={chainId} signer={signer} type="home"/>
      <SellNFTs />
      <Footer />
    </div>
  )
}
