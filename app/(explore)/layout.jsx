import TagsSidebar from "@components/tags-sidebar"

const ArticleLayout = ({children}) => {
  return (
        <div >
            {children}
            <TagsSidebar />
        </div>
  )
}

export default ArticleLayout