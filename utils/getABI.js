import abiMappings from "../constants/abiMappings.json"

async function getABI(contractAddress)
{
  const url = `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
  let abi
  if(contractAddress in abiMappings){
    abi = abiMappings[contractAddress]
    return abi
  }
  else{
    try
    {
      abi = await fetch(url).then(res => res.json()).then(data => {return data.result}).catch(e=>console.log(e))
      await fetch("/api/storeAbi", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contractAddress,
          abi
        })
      })
      return abi
    }catch(e){
      console.log(e)
      await getABI(contractAddress)
    }
  }
}

export default getABI