import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BigNumber, ethers } from "ethers"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { GET_COLLECTION, GET_FLOOR_NFT } from "../../constants/subGraphQueries"
import getABI from "../../utils/getABI"
import { truncateStr } from "../../utils/truncateStr"
import styles from "./CollectionCard.module.css"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function CollectionCard({ address, isConnected, signer }) {
	const [collectCollection, setCollectCollection] = useState(false)
	const [loaded, setLoaded] = useState(false)
	const [floorPrice, setFloorPrice] = useState(BigNumber.from("0"))
	const [tokenName, setTokenName] = useState("")
	const [tokenDescription, setTokenDescription] = useState("")
	const [imageURI, setImageURI] = useState("")
	const [collectionImageURI, setCollectionImageURI] = useState("")

	async function getCardDets(nftAddress) {
		const client = new ApolloClient({
			uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
			cache: new InMemoryCache(),
		})

		const currCollection = await client
			.query({
				query: GET_COLLECTION,
				variables: { activeCollection: nftAddress },
			})
			.then((data) => {
				return data
			})
			.catch((err) => {
				console.log("Error fetching data: ", err)
			})
		if (currCollection) {
			setFloorPrice(currCollection.data.collectionFound.floorPrice)
			setTokenName(currCollection.data.collectionFound.name)
			const tokenURI = currCollection.data.collectionFound.tokenURI
			const imgURI = await fetch(
				tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
			)
				.then((res) => res.json())
				.then((data) => data.image.replace("ipfs://", "https://ipfs.io/ipfs/"))
			setImageURI(imgURI)
		}
	}

	useEffect(() => {
		isConnected && getCardDets(address)
		!imageURI && getCardDets(address)
	}, [isConnected, imageURI])

	return (
		<div
			className={styles["apio__collectionCard"]}
			onMouseEnter={() => {
				setCollectCollection(true)
			}}
			onMouseLeave={() => {
				setCollectCollection(false)
			}}
		>
			<div className={styles["apio__collectionCard--image"]}>
				{/* {console.log(imageURI)} */}
				{!loaded && (
					<Skeleton
						style={{ height: "100%", borderRadius: "1.46vw" }}
						baseColor="#444"
						highlightColor="#626262"
					/>
				)}
				{imageURI && (
					<div className={styles["nimg"]}>
						<Image
							onLoad={() => {
								setLoaded(true)
							}}
							loader={() => imageURI}
							src={imageURI}
							alt="NFT"
							layout="fill"
							objectFit="cover"
						/>
					</div>
				)}
			</div>
			<div className={styles["apio__collectionCard--text"]}>
				<h3 className={styles["apio__collectionCard--text--name"]}>
					{`${tokenName}` || <p></p>}{" "}
				</h3>
				<a
					href={`https://goerli.etherscan.io/token/${address}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<p className={styles["apio__collectionCard--creator"]}>
						@{truncateStr(address || "", 12)}
					</p>
				</a>
				<div className={styles["apio__collectionCard--text--price"]}>
					<div className={styles["apio__collectionCard--floor_price"]}>
						<p>
							Floor Price:{" "}
							{ethers.utils.formatUnits(floorPrice, "ether") || "0.0"} sETH
						</p>
					</div>
					<p>
						<FontAwesomeIcon
							icon="fa-brands fa-ethereum"
							className={styles["apio__collectionCard--eth_icon"]}
						/>
					</p>
				</div>
				<Link href={`/explore/${address}`}>
					<div
						className={
							collectCollection
								? styles["apio__collectionCard--collectCollection"]
								: styles["hide_collectCollection"]
						}
					>
						<button>Collect Now!</button>
					</div>
				</Link>
			</div>
		</div>
	)
}
