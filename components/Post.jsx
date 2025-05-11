import Link from "@node_modules/next/link"
import { EyeIcon } from "./icons"
import { Tag } from "./tags"

const Post = ({data, parentSlug}) => {
  const href = data.redirect || `/${parentSlug}/${data.slug}`;

  return (
          <div className='posts-card'>
            <Link href={href}>
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
            <div className="posts-info">
              <Link className="posts-card-title" href={href}><h3 className="m-0 text-base font-normal">{data.title}</h3></Link>
              <p>{data.date}</p>
              <div className="flex gap-1 ">
                {data.tags?.map((tag ,index) => <Tag tag={tag} key={index}/>)}
              </div>
            </div>
          </div>
  )
}
export default Post