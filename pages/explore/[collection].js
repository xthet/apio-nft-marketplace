import Head from "next/head"
import useConnection from "../../utils/useConnection"
import { useRouter } from "next/router"
import { Brands, Navbar, NFTCard, Notice } from "../../components/exportComps"
import { Header, Footer, SellNFTs, Collections, NFTGrid } from "../../containers/exportConts"
import ErrorPage from "next/error"
import styles from "../../styles/Home.module.css"

export default function Explore() {
  const router = useRouter()
  const { collection } = router.query
  const { hasMetamask, isConnected, chainId, signer, account, connect } = useConnection()
 

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
