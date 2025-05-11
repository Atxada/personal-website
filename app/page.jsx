import Link from "@node_modules/next/link";
import { DocumentIcon } from "@components/icons";
import { getAllPosts } from "@utils/posts";
import Article from "@components/Article";
import Project from "@components/Project";

const Home = () => {
  const articles = getAllPosts();
  const articlePosts = articles.filter((post) => post.category === "articles")

  const projects = getAllPosts();
  const projectPosts = projects.filter((post) => post.category === "projects")
  const selectedProject = ["Disney Mirrorverse Character Rigs", 'Sofy Ruby Character Rigs', 'PUBG: 13 Days of Halloween' , 'Rubik Rig']
  const featuredProjects = projectPosts.filter(post =>
    selectedProject.includes(post.title)).sort((a, b) => selectedProject.indexOf(a.title) - selectedProject.indexOf(b.title))
  

  return (
      <div className="home-div">
        <section className="home-hero">
          <div className="home-h-flex">
            <div className="home-v-flex">
              <h1 className="m-0">Solving <span>Technical Barrier</span> of 3D Production</h1>
              <p className="text-[#cec096] leading-6 m-0"> 
                Hi! My name is <strong>Aldo Aldrich</strong>, I'm a <strong>Technical artist</strong> who specializes 
                in <strong>Rigging</strong> with more than 3 years of experience. Beside rigging, I also
                create a custom tools and help solving technical problem in the studio.
              </p>
              <Link target="_blank" href="files/CV.pdf" className="showreel-btn"> <DocumentIcon /> 2025 Resume </Link>
            </div>
            <div>
                {/* <video id="video_background" src="https://media.room8studio.com/wp-content/uploads/2022/06/04202038/r8s.mp4" width="560" height="315" autoPlay loop muted playsInline data-reveal="clip" data-delay="0.5" data-intro-video="" ></video> */}
                <iframe className="showreel-vid" src="https://www.youtube.com/embed/HrYZbxO3Jso?si=9nuqOzCTGNda4Y-4&autoplay=0" width="560" height="315" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> 
            </div>
          </div>
        </section>
        <section className="featured-works-section bg-[#e7e7e7] text-[#e96d30] pt-5 pb-14 flex gap-7 flex-col justify-center items-center">
            <h2 className="text-center text-4xl font-mono mb-0">FEATURED WORKS</h2>
            <ul className="selected-project">
              {featuredProjects.map((post, index) => (
              <li key={index}>
                  <Project data={post} parentSlug="projects"></Project>
              </li>))}
            </ul>
            <Link href="/projects" className="explore-project-btn">Others <span className="explore-project-inner">{projectPosts.length - featuredProjects.length}</span></Link>
        </section>
        <section className="hidden">
            <h2 className="text-center text-3xl">AREAS OF EXPERTISE</h2>
            <section className="services-flex">
              <div className="flex-row">
                <h3 className="services-name" >Rigging</h3>
                <p className="max-w-xl">
                  Our rigging team has set-up thousands of characters of every shape, size and style. We support our rigging artists with a robust pipeline/tools team who constantly ensure our internal solutions are cutting edge whilst delivering world-class technology to improve the lives of our clients. Whatever you need, there’s a good chance we’ve already done it.  And if we haven’t yet, we look forward to working it out with you.
                </p>
              </div>
              <img src="https://gimbalzen.com/wp-content/uploads/2022/05/Services_CharacterRigging.png" width="600" />
            </section>
            <section className="services-flex">
              <img src="https://gimbalzen.com/wp-content/uploads/2022/05/Services_PipelineandTools.png" width="600" />
              <div className="flex-row">
                <h3 className="services-name">Tools & Pipelines</h3>
                <p className="max-w-xl">
                  With decades of tools and pipeline experience we are constantly improving our own internal tech, and sharing updates with our partners who use our rigging tools.  We’ve provided solutions for procedural modeling, blendshape transfers, rigging and skinning, naming conventions, model processing, real-time engine previews, rendering, turntables and automated lip-sync.  If you think your production pipeline can be improved we would be happy to take a look.
                </p>
              </div>
            </section>
            <section className="services-flex">
              <div className="flex-row">
                <h3 className="services-name">Game Development</h3>
                <p className="max-w-xl">
                  Our concept team offer a diverse, wide range of experience and styles based around a creative process of asking the right questions.  To deliver what you need its imperative we’re inside your world, pulling from the same core concepts and driven by the same influences.  From believable characters and vehicles to ancient habitats and sci-fi terrains, we provide more than just beautifully art directed images.
                </p>
              </div>
              <img src="https://gimbalzen.com/wp-content/uploads/2023/03/Concept.jpg" width="600" />
            </section>
        </section>
        <section className="latest-article-section">
            <h2 className="text-3xl">LATEST ARTICLES</h2>
            <hr className="border-[#777777] dynamic-hr"></hr>
            <ul className="flex flex-col gap-6 p-0 my-12">
              {articlePosts.map((post, index) => (
              <li key={index}>
                  <Article data={post} parentSlug="articles"></Article>
              </li>))}
            </ul>
        </section>
      </div>
  )
}

export default Home

  {/* <Season />
  <About />
  <ArticleSection />
  <ProjectSection />
  <Contact /> */}