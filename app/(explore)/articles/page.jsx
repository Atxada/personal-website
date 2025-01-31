import React from 'react'
import { getAllPosts, getAllTags, sortByName } from '@utils/posts'
import Post from '@components/Post';

const Articles = () => {
  const posts = getAllPosts();
  const articlePosts = posts.filter((post) => post.category === "articles")

  return (
        <div className='page-content'>
          <header className='page-header'>
            <h2 className='page-title'>Articles</h2>
            <p className='page-desc'>Found {articlePosts.length} articles</p>
          </header>
          <ul className='posts-container'> 
            {articlePosts.map((post, index) => (
              <li key={index}>
                  <Post data={post} parentSlug="articles"></Post>
              </li>))}
          </ul>
        </div>
  )
}

export default Articles