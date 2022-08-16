import styles from "./NFTGrid.module.css"
import { CollectionHeader, NFTCard } from "../../components/exportComps"
import { GET_NFTS, GET_FLOOR_NFT, GET_COLLECTION } from "../../constants/subGraphQueries"
import { useQuery, ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"
import useTokenURI from "../../utils/useTokenURI"

export default function NFTGrid({ connect, isConnected, chainId, signer, address, account })
{
  const [currentNFTData, setCurrentNFTData] = useState([])
  const [currentOffset, setCurrentOffset] = useState(0)
  const [cardPrice, setCardPrice] = useState(ethers.BigNumber.from("0"))
  const [collectionName, setCollectionName] = useState(undefined)
  // const [cardTokenId, setCardTokenId] = useState()
  // const [activeABI, setActiveABI] = useState(undefined)
  const { tokenName, tokenDescription, imageURI, collectionImageURI, getTokenURI } = useTokenURI()

  
  async function getNFTData()
  {
    const activeNFTAddress = await address
    const client = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
      cache: new InMemoryCache(),
    })

    const NFTData = await client
      .query({
        query: gql(GET_NFTS),
        variables: { activeNFTAddress: activeNFTAddress, offset: currentOffset },
      })
      .then(async (data) => {
        // console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })

    const collectionData = await client
      .query({
        query: gql(GET_COLLECTION),
        variables: { activeNFTAddress: activeNFTAddress },
      })
      .then(async (data) => {
        console.log("Subgraph data: ", data)
        return data
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })
    
    const [floorPrice, floorTokenId] = await client
      .query({
        query: gql(GET_FLOOR_NFT),
        variables: { activeNFTAddress: activeNFTAddress },
      })
      .then(async (data) => {
        // console.log("Subgraph data: ", data)
        const floorPrice = await data.data.activeItems[0].price
        const floorTokenId = await data.data.activeItems[0].tokenId
        // const success = await getTokenURI(activeNTAddress, "0", true)

        return [floorPrice, floorTokenId]
      })
      .catch((err) => {
        console.log("Error fetching data: ", err)
      })

    setCollectionName(collectionData.data.collectionFounds[0].name)
    setCardPrice(floorPrice)
    // setCardTokenId(floorTokend)

    setCurrentNFTData(prev => [...prev, ...NFTData.data.activeItems])
  }

  function handleGridScroll({ currentTarget })
  {
    if(currentTarget.clientHeight + currentTarget.scrollTop + 1 >= currentTarget.scrollHeight)
    {
      setCurrentOffset(prev => prev + 5)
      console.log("here")
    }
  }

  useEffect(()=>
  {
    async function runUI()
    {
      await getNFTData()
    }
    isConnected && runUI()
  },[isConnected, currentOffset])

  return (
    <div className={`section__padding ${styles["apio__NFTGrid"]}`}>
      {!collectionName ? console.log("Loading..") : !currentNFTData ? <p>Loading...</p> 
        : <CollectionHeader name={collectionName} address={address} floorPrice={cardPrice} imageURI={collectionImageURI}/>
      }
      <div className={isConnected ? styles["apio__NFTGrid--isConnected"] : styles["apio__NFTGrid--toConnect"]}>
        <p>You need to connect your wallet to view NFTs</p>
        <button onClick={connect}>Connect your wallet</button>
      </div>
      <div className={styles["apio__NFTGrid--grid_container"]}>
        <div className={isConnected ? styles["apio__NFTGrid--grid"] : styles["apio__NFTGrid--notConnected"]} onScroll={handleGridScroll}>
          {!currentNFTData ? <p>Loading...</p> : currentNFTData.map((NFT, index)=>{
            const { price, tokenId, nftAddress, seller } = NFT
            getTokenURI(nftAddress, tokenId)
            getTokenURI(nftAddress, "0", true)
            return (
              <NFTCard
                key={index}
                price={price}
                nftAddress={nftAddress}
                name={tokenName}
                description={tokenDescription}
                imageURI={imageURI}
                tokenId={tokenId}
                seller={seller}
                account={account}
                chainId={chainId}
                signer={signer}
                // type={"userListing"}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}