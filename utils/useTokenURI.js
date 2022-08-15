import { BigNumber, ethers } from "ethers"
import getABI from "./getABI"
import { useEffect, useState } from "react"
import useConnection from "./useConnection"


export default function useTokenURI()
{
  const [tokenName, setTokenName] = useState("")
  const [tokenDescription, setTokenDescription] = useState("")   
  const [imageURI, setImageURI] = useState("")
  const [collectionImageURI, setCollectionImageURI] = useState("") 

  const { hasMetamask, isConnected, chainId, signer, account, connect } = useConnection()


  async function getTokenURI(nftAddress, tokenId, collectionType = false)
  {
    if (typeof window.ethereum !== "undefined")
    {
      try{
        const nftABI = await getABI(nftAddress)
        const NFTContract = new ethers.Contract(nftAddress, nftABI, signer)
        const tokenURI = await NFTContract.tokenURI(tokenId)
        collectionType ? await mutateURI(tokenURI, true) : await mutateURI(tokenURI)
      }catch(e){console.log(e)}

      // setActiveABI(nftABI)
    }

    async function mutateURI(tokenURI, collectionType = false)
    {
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/") // switching to https
      const tokenURIResponse = await (await fetch(requestURL)).json() 
      const imageURI = tokenURIResponse.image
      const imageToURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      !collectionType ? setImageURI(imageToURL) : setCollectionImageURI(imageToURL) 
      setTokenName(tokenURIResponse.name)
      setTokenDescription(tokenURIResponse.description)
      return true
    }
  }

  return { tokenName, tokenDescription, imageURI, collectionImageURI, getTokenURI }
}