import Link from "@node_modules/next/link"
import { Tag } from "./tags"

const Article = ({data, parentSlug}) => {
  return (
          <div className='article-card'>
            <Link  className="article-preview-wrapper" href={`/${parentSlug}/${data.slug}`}>
              <img className='article-preview' src={data.thumbnail} alt={data.alt}></img>
            </Link>
            <div className="article-info">
              <Link className="max-w-fit" href={`/${parentSlug}/${data.slug}`}><h3 className="article-card-title">{data.title}</h3></Link>
              <p className="article-excerpt">{data.excerpt}</p>
              <p>{data.date}</p>
              <div className="flex gap-1 ">
                {data.tags?.map((tag ,index) => <Tag tag={tag} key={index}/>)}
              </div>
            </div>
          </div>
  )
}
export default Article