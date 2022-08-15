import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { ethers } from "ethers"

export default function useConnection()
{
  const router = useRouter()
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState("31337")
  const [signer, setSigner] = useState(undefined)
  const [account, setAccount] = useState("0x0")

  async function connect()
  {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
        setIsConnected(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setSigner(provider.getSigner())
        const { chainId } = await provider.getNetwork()
        // console.log(chainId)
        setChainId(chainId.toString())
      } catch (e) {
        console.log(e)
      }
    } else {
      setIsConnected(false)
    }
  }

  async function updateUI()
  {
    if(typeof window.ethereum !== "undefined")
    {
      try {
        const accounts = await ethereum.request({ method: "eth_accounts" })
        if(accounts.length)
        {
          setIsConnected(true)
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          setSigner(provider.getSigner())
          const { chainId } = await provider.getNetwork()
          // console.log(chainId)
          setAccount(accounts[0])
          setChainId(chainId.toString())
        }
        else{setIsConnected(false)}

      } catch (e) {
        console.log(e)
      }

      window.ethereum.on("chainChanged", () => {
        // router.reload()
        updateUI()
      })
      window.ethereum.on("accountsChanged", () => {
        // router.reload()
        updateUI()
      })
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true)
      updateUI()
    }
  }, [account, chainId])

  return { hasMetamask, isConnected, chainId, signer, account, connect }
}