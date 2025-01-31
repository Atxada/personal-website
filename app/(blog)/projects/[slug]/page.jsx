import React from 'react'
import Blog from '@components/Blog';

export const generateStaticParams = () => { // generate params at build time rather than on click
    const posts = getAllPosts();
    const articlePosts = posts.filter((post) => post.category === "projects")
    const paths = Object.keys(articlePosts).map(path => ({path: slug(path)}));
    return paths;
}

const page = ({params}) => {
  return (
    <Blog params={params}/>
  )
}

export default page