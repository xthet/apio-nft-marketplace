import { gql, useQuery } from "@apollo/client"

const GET_COLLECTIONS = gql`
{
  collectionFounds(first: 5, orderBy: createdAt, orderDirection: desc) {
    name
    symbol
    nftAddress
  }
}
`

const GET_DROP_COLLECTIONS = `
  query getCollections($offset: Int!){
    collectionFounds(first: 5, skip: $offset, orderBy: createdAt, orderDirection: desc) {
      name
      symbol
      nftAddress
    }
  }
`

const GET_FOUR_COLLECTIONS = `
  query getCollections{
    collectionFounds(first: 4, orderBy: createdAt, orderDirection: desc) {
      name
      symbol
      nftAddress
    }
  }
`

const GET_COLLECTION = `
  query GetCollection($activeNFTAddress: String!) {
    collectionFounds(first: 1, where:{nftAddress: $activeNFTAddress}) {
      name
      symbol
      nftAddress
    }
  }
`

const GET_FLOOR_NFT = `
  query GetNFTData($activeNFTAddress: String!) {
    activeItems(first: 1, where:{nftAddress: $activeNFTAddress}, orderBy: price, orderDirection: asc) {
      price
      tokenId
    }
  }
`

const GET_NFTS = `
  query getNFTs($activeNFTAddress: String!, $offset: Int!) {
    activeItems(first: 5, skip: $offset, where:{nftAddress: $activeNFTAddress}, orderBy: createdAt, orderDirection: desc) {
      id
      price
      tokenId
      seller
      nftAddress
    }
  }
`

const GET_USER_LISTINGS = `
  query getUserListings($activeAccount: String!, $offset: Int!) {
    activeItems(first: 5, skip: $offset, where:{seller: $activeAccount}, orderBy: createdAt, orderDirection: desc) {
      id
      nftAddress
      seller
      tokenId
      price
    }
  }
`

const GET_COLLECTION_NAME = `
  query collectionName($activeNFTAddress: String!) {
    collectionFounds(where:{nftAddress: $activeNFTAddress}) {
      name
    }
  }
`

export { GET_COLLECTIONS, GET_FLOOR_NFT, GET_NFTS, GET_COLLECTION, GET_USER_LISTINGS, GET_COLLECTION_NAME, GET_DROP_COLLECTIONS, GET_FOUR_COLLECTIONS }