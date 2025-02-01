import Link from "@node_modules/next/link"
import { EyeIcon } from "./icons"
import { Tag } from "./tags"

const Post = ({data, parentSlug}) => {
  return (
          <div className='posts-card'>
            <Link href={`/${parentSlug}/${data.slug}`}>
              <div className='posts-preview'>
                <div className='posts-preview-wrapper'>
                  <img src={data.thumbnail} alt={data.alt}></img>
                  <div className='posts-eye-anim'>
                    <span>View</span>
                    <EyeIcon />
                  </div>
                </div>
              </div>
            </Link>
            <div className="posts-info  overflow-hidden">
              <Link className="posts-card-title  overflow-hidden" href={`/${parentSlug}/${data.slug}`}><h3 className="m-0 text-base font-normal">{data.title}</h3></Link>
              <p>{data.date}</p>
              <div className="flex  gap-1 ">
                {data.tags?.map((tag ,index) => <Tag tag={tag} key={index}/>)}
              </div>
            </div>
          </div>
  )
}
export default Post

//old
/* <div className="post">
<div className="post-preview">
</div>
<div className="post-texts">
    <ul className="post-categories">
        <li><a href="/">News</a></li>
        <li><a href="/">Tech Art</a></li>
    </ul>
    <h3>Some cat is still Missing and needed to be found!</h3>
    <p className="post-info">
        <a className="post-author" href="/">Aldo Ganteng</a>
        <time>Dec 25, 2024</time>
    </p>
</div>
</div> */