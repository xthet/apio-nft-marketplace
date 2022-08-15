const { ethereum } = require("../components/brands/imports")

async function connect()
{

  if (typeof window.ethereum !== "undefined")
  {
    try{
      await ethereum.request({ method: "eth_requestAccounts" })
    }
    catch(e){console.log(e)}
  }
}

module.exports = { connect }