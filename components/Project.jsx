import Link from "@node_modules/next/link"
import { Tag } from "./tags"

const Project = ({data, parentSlug}) => {
  const href = data.redirect || `/${parentSlug}/${data.slug}`;

  return (
          <div className='project-card'>
            <Link href={href}>
              <img className='project-preview' src={data.thumbnail} alt={data.alt}></img>
            </Link>
            <div className="project-info">
              <Link href={href}><h3 className="project-card-title">{data.title}</h3></Link>
            </div>
          </div>
  )
}
export default Project