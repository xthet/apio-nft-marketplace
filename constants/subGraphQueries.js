import { gql } from "@apollo/client"

const GET_COLLECTIONS = gql`
{
  collectionFounds(first: 5, orderBy: createdAt, orderDirection: desc) {
    name
    symbol
    nftAddress
    tokenURI
  }
}
`

const GET_DROP_COLLECTIONS = gql`
  query getCollections($offset: Int!){
    collectionFounds(first: 5, skip: $offset, orderBy: createdAt, orderDirection: desc) {
      name
      symbol
      nftAddress
      tokenURI
    }
  }
`

const GET_REAL_COLLECTIONS = gql`
  query getRealCollections($nftAddress: String!){
    activeItems(where:{nftAddress: $nftAddress}){
      tokenId
    }
  }
`

const GET_FOUR_COLLECTIONS = gql`
  query getCollections{
    collectionFounds(first: 10, orderBy: createdAt, orderDirection: desc) {
      name
      symbol
      nftAddress
      tokenURI
    }
  }
`

const GET_COLLECTION = gql`
  query GetCollection($activeCollection: String!) {
    collectionFound(id:$activeCollection) {
      name
      symbol
      nftAddress
      tokenURI
      floorPrice
    }
  }
`

const GET_FLOOR_NFT = gql`
  query GetNFTData($activeNFTAddress: String!) {
    activeItems(first: 1, where:{nftAddress: $activeNFTAddress}, orderBy: price, orderDirection: asc) {
      price
      tokenId
      tokenURI
    }
  }
`

const GET_NFTS = gql`
  query getNFTs($activeNFTAddress: String!, $offset: Int!) {
    activeItems(first: 5, skip: $offset, where:{nftAddress: $activeNFTAddress}, orderBy: createdAt, orderDirection: desc) {
      id
      price
      tokenId
      seller
      nftAddress
      tokenURI
    }
  }
`

const GET_USER_LISTINGS = gql`
  query getUserListings($activeAccount: String!, $offset: Int!) {
    activeItems(first: 5, skip: $offset, where:{seller: $activeAccount}, orderBy: createdAt, orderDirection: desc) {
      id
      nftAddress
      seller
      tokenId
      price
      tokenURI
    }
  }
`

const GET_COLLECTION_NAME = gql`
  query collectionName($activeNFTAddress: String!) {
    collectionFounds(where:{nftAddress: $activeNFTAddress}) {
      name
    }
  }
`

export { GET_REAL_COLLECTIONS, GET_COLLECTIONS, GET_FLOOR_NFT, GET_NFTS, GET_COLLECTION, GET_USER_LISTINGS, GET_COLLECTION_NAME, GET_DROP_COLLECTIONS, GET_FOUR_COLLECTIONS }
