import Post from '@components/Post';
import { Tag } from '@components/tags';
import { slug } from '@node_modules/github-slugger';
import { getAllPosts, getAllTags, getPostsByTagSlug } from '@utils/posts';
import React from 'react'


export const generateStaticParams = () => { // generate params at build time rather than on click
    const posts = getAllPosts();
    const tags = getAllTags(posts);
    const paths = Object.keys(tags).map(tag => ({tag: slug(tag)}));
    return paths;
}

const TagPage = async ({params}) => {
    const posts = getAllPosts();
    const {tag} = await params;
    const title = tag.split("-").join(" "); // make tags prettier by removing gh slugger name to space
    const displayPosts = getPostsByTagSlug(posts, tag);
    
    return (
        <div className='page-content'>   
            <header className='page-header'>
                <h2 className='page-title'>Tags</h2>
                <p className='page-desc'>{title}</p>
            </header>      
            <ul className='posts-container'> {displayPosts.map((post, index) => (
                <li key={index}>
                    <Post data={post} parentSlug={post.category}></Post>
                </li>))}
            </ul>
        </div>
    )
}

export default TagPage