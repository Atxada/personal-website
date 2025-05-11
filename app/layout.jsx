import { Children } from "react"
import Link from '@node_modules/next/link'
import "@styles/global.css" // refer to jsconfig.json > right now it configured to take everything from root route

import Nav from "@components/Nav"
import Footer from "@components/Footer";

// define data with data > in this case we defining what is our web app about
export const metadata = {
  title: "Reiga",
  description: "Tech art learning"
}

const RootLayout = ({children}) => {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main >{children}</main>
        <Footer />
      </body>
    </html>
  )
}

export default RootLayout