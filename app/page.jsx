import Link from "@node_modules/next/link";
import { CubeIcon, DocumentIcon, EmailIcon, GithubIcon, LinkedinIcon, MapIcon, NewsIcon } from "@components/icons";
import Showreel from "@components/Showreel";

const Home = () => {
  return (
      <div className="home-bg">
        <div className="gradient-card-wrapper">
          <div className="gradient-card">
            <div className="home-h-flex">
              <section className="home-v-flex">
                <h1>Currently Solving <span>Technical Art</span></h1>
                <p className="text-[#bcbcbc] leading-6"> 
                  Hi! My name is <strong>Aldo Aldrich</strong>, I'm a <span className="text-[#2f8ce3] text-lg">Technical artist</span> who specializes 
                  in <span className="text-[#e3742f] text-lg">Rigging</span> from Indonesia. Since 2022, I've been making a various types of rigging, 
                  create a custom tools using Python, and help solving technical problem in the studio.
                </p>
                <nav>
                  <ul className="flex gap-3">    
                    <li>
                        <Link className="home-nav-btn" href="/projects">
                            <CubeIcon /> Portofolio
                        </Link>
                    </li>
                    <li>
                        <Link className="home-nav-btn" href="/articles">
                            <NewsIcon /> Article
                        </Link>
                    </li>
                    {/* <li>
                        <Link className="home-nav-btn" href="/articles">
                            <MapIcon /> Roadmap
                        </Link>
                    </li> */}
                  </ul>  
                </nav>
              </section>
              <section className="home-v-flex gap-3 profile-card">
                <div className="profile-pic-wrapper ">
                  <img className='object-cover max-w-36 m-2 rounded-full'src="images/me.png"></img>
                </div>
                <div className="flex gap-2 justify-center">
                  <Showreel />
                  <Link className="home-resume-btn" href="https://www.canva.com/design/DAGTVT7XRv0/iuxxyq5etidgioqn0RNucA/edit?utm_content=DAGTVT7XRv0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"><DocumentIcon />Resume</Link>
                </div>
                <div className="available-to-work flex gap-2 items-center justify-center">
                  <div className="online-dot size-4"><span></span></div>
                  <p className="m-0 font-thin">Available for work</p>
                </div>
                <div className="flex gap-1 justify-center">
                  <Link className="home-contact-btn" href="https://www.linkedin.com/in/aldo-aldrich-962975220/"><LinkedinIcon /></Link>
                  <Link className="home-contact-btn" href="https://github.com/Atxada"><GithubIcon /></Link>
                  <Link className="home-contact-btn" href="mailto:atxadacony@gmail.com"><EmailIcon /></Link>
                </div>
              </section>
            </div>
            <p className="copyright-lbl">© 2025 Aldo Aldrich</p>
          </div>
        </div>
      </div>
  )
}

export default Home

  {/* <Season />
  <About />
  <ArticleSection />
  <ProjectSection />
  <Contact /> */}