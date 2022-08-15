import "../styles/globals.css"
import "../styles/index.css"
import NotificationProvider from "../utils/NotificationProvider"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { fab, faTwitter, faFontAwesome } from "@fortawesome/free-brands-svg-icons"

library.add(fab, fas, faTwitter, faFontAwesome)

const graphClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI
})

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <NotificationProvider>
        <ApolloProvider client={graphClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </NotificationProvider>
    </div>
  )
}

export default MyApp
