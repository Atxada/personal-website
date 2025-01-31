import React from 'react'
import { getAllPosts } from '@utils/posts'
import { notFound } from '@node_modules/next/navigation';
import CodeBlocks from '@components/code-blocks';
import ImgCaption from '@components/Img-caption';
import Markdown from '@node_modules/markdown-to-jsx';
import MarkdownIt from 'markdown-it';
import { CalendarIcon, TagIcon } from '@components/icons';
import { Tag } from '@components/tags';
import PageNav from '@components/Page-nav';
import CodeText from './code-text';

// seems no improvement? maybe take affect after build/deploy?
export const generateStaticParams = () => {
    const posts = getAllPosts();
    const paths = posts.map(post => ({post: post.slug}))
    return paths
}

async function fetchPosts(slug) {
    const posts = getAllPosts()
    return posts.find((post) => post.slug === slug);
}

export default async function Blog({params}) {
  const {slug} = await params; // Wait for params to resolve
  const post = await fetchPosts(slug);

  if (!post) notFound();

  // get markdown it all h2 to render as on this pag
  const md = new MarkdownIt();
  
  // Parse the Markdown into tokens
  const tokens = md.parse(post.content, {});
  
  // Extract content of all <h2> elements
  const h2Headings = [];
  for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'heading_open' && tokens[i].tag === 'h2') {
          // The next token contains the text of the heading
          const contentToken = tokens[i + 1];
          if (contentToken && contentToken.type === 'inline') {
              h2Headings.push(contentToken.content);
          }
      }
  }

  return (
    <div className='blog-main'>
      <article className='blog-page'>
          <h1 className='blog-title'>{post.title}</h1>
          <div className='blog-date-tag'>
            <div className='mt-1 mb-1 flex justify-center items-center gap-1'>
              <CalendarIcon/>
              {post.date}
            </div>
            <div className='mt-1 mb-1 flex justify-center items-center gap-1'>
              {post.tags?<TagIcon/>:''}
                {post.tags?.map((tag ,index) => <div key={index} ><Tag tag={tag} /></div>)}
            </div>
          </div>
          <Markdown className='blog-content' options={{
            overrides: {
              code: CodeBlocks,
              img: ImgCaption,
              CodeText: CodeText
            }
          }}>{post.content}</Markdown>
      </article>
      <PageNav h2Headings={h2Headings}/>
    </div>
  )
}

/* 
old way just put thumbnail meta data at the start of blog

<div className="blog-intro-pic text-center">
  <img src={post.thumbnail} alt={post.alt}></img>
</div> 
*/