import React from 'react'
import Blog from '@components/Blog';

const page = ({params}) => {
  return (
    <Blog params={params}/>
  )
}

export default page