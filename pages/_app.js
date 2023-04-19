import "../styles/globals.css"
import "../styles/index.css"
import NotificationProvider from "../utils/NotificationProvider"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { fab, faTwitter, faFontAwesome } from "@fortawesome/free-brands-svg-icons"
import { ConnectionProvider } from "../contexts/connection"

library.add(fab, fas, faTwitter, faFontAwesome)

const graphClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI
})

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ConnectionProvider>
        <NotificationProvider>
          <ApolloProvider client={graphClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </NotificationProvider>
      </ConnectionProvider>
    </>
  )
}

export default MyApp
