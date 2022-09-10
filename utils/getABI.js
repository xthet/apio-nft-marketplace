async function getABI(contractAddress)
{
  const url = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
  try{
    const abi = await fetch(url).then(res => res.json()).then(data => {return data.result}).catch(e=>console.log(e))
    return abi
  }catch(e){
    console.log(e)
    getABI(contractAddress)
  }

}

export default getABI