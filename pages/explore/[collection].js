import ErrorPage from "next/error"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext } from "react"
import { Navbar } from "../../components/exportComps"
import { Footer, NFTGrid } from "../../containers/exportConts"
import { ConnectionContext } from "../../contexts/connection"

export default function Explore() {
  const router = useRouter()
  const { collection } = router.query
  const { isConnected, signer, account, provider, connect, chainId } = useContext(ConnectionContext)
 

  return (
    <div className="App gradient__bg">
      <Head>
        <title>apio - Explore</title>
        <meta name="apio-project" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
    
      <div>
        <Navbar connect={connect} isConnected={isConnected} signer={signer} account={account}/>
        {/* <Notice /> */}
      </div>

      {
        !collection
          ? <p>Loading</p> 
          : collection.includes("0x") && collection.length == 42 
            ? <NFTGrid connect={connect} isConnected={isConnected} chainId={chainId} signer={signer} address={collection} account={account}/>
            : <ErrorPage statusCode={404}/>
      }
      <Footer />
    </div>
  )
}
