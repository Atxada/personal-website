import React from 'react'
import { getAllPosts, getAllTags, sortByName } from '@utils/posts'
import Post from '@components/Post';

const Projects = () => {
  const posts = getAllPosts();
  const projectPosts = posts.filter((post) => post.category === "projects")

  return (
        <div className='page-content'>
          <header className='page-header'>
            <h2 className='page-title'>Project</h2>
            <p className='page-desc'>Found {projectPosts.length} projects</p>
          </header>
          <ul className='posts-container'> 
            {projectPosts.map((post, index) => (
              <li key={index}>
                  <Post data={post} parentSlug="projects"></Post>
              </li>))}
          </ul>
        </div>
  )
}

export default Projects