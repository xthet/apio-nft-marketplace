const fs = require("fs")

const abiMappingsFile = "./constants/abiMappings.json"

export default async function storeAbi(req, res){
  if (req.method !== "POST"){
    res.status(405).send({ message: "Only post requests allowed" })
  }
  const abi = await req.body
  // console.log(abi)
  const abiMappings = await JSON.parse(fs.readFileSync(abiMappingsFile, "utf-8"))
  abiMappings[abi.contractAddress] = abi.abi
  await fs.writeFileSync(abiMappingsFile, JSON.stringify(abiMappings))
  res.status(200).send({ message: abi })
}