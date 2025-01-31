import { Children } from "react"
import "@styles/global.css" // refer to jsconfig.json > right now it configured to take everything from root route

import Nav from "@components/Nav"

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
      </body>
    </html>
  )
}

export default RootLayout