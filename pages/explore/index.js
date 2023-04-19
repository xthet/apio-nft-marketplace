import Head from "next/head"
import { useContext } from "react"
import { Navbar } from "../../components/exportComps"
import { Collections, Footer } from "../../containers/exportConts"
import { ConnectionContext } from "../../contexts/connection"


export default function Explore() {
  const { isConnected, signer, account, provider, connect, chainId } = useContext(ConnectionContext)

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
