import React from 'react'
import { Tag } from './tags'
import { getAllPosts, getAllTags } from '@utils/posts';

const TagsSidebar = () => {

    const posts = getAllPosts();
    const tags = getAllTags(posts)
    const sortedTags = Object.keys(tags).sort()

    return (
        <div className="tags-sidebar">
            <h2 className='text-xl'>Tags</h2>
            {sortedTags?.map((tag) => (
                <Tag tag={tag} key={tag} count={tags[tag]}/>
            ))}
        </div>
    )
}

export default TagsSidebar

// const TagsPage = () => {
//     const posts = getAllPosts();
//     const tags = getAllTags(posts)
    

//     return (
//         <div className='max-w-4xl py-6'>
//             <div className="flex flex-col items-start gap-4">
//                 <div className="flex-1 space-y-4">
//                     <h1 className='inline-block font-white text-4xl'>Tags</h1>
//                 </div>
//             </div>
//             <hr className='my-4' />
//             <div className="flex flex-wrap gap-2">
//                 {sortedTags?.map(tag => <Tag tag={tag} count={tags[tag]} key={tag}/>)}
//             </div>
//         </div>
//   )
// }

// <div className='flex items-center m-20'>
// {sortedTags?.map((tag) => (
//     <Tag tag={tag} key={tag} count={tags[tag]}/>
// ))}
// </div>