'use client';
import React, { useState, useEffect } from 'react';
import HomeNavBar from './components/HomeNavBar';
import CategoryBar from "./components/CategoryBar";
import Footer from './components/Footer';
import { useRouter } from "next/navigation";
import {
  getAllPosts,
  getEmployeeById,
  getAllCategories,
  getPostsByCategoryId
} from './services/Api';
import './styles/Home.css';


export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [authorMap, setAuthorMap] = useState({});
  const [breakingNews, setBreakingNews] = useState([]);
  const [tamilnaduNews, setTamilNaduNews] = useState([]);
  const [indiaNews, setIndiaNews] = useState([]);
  const [worldNews, setWorldNews] = useState([]);
  const [sportsNews, setSportsNews] = useState([]);
  const [cinemaNews, setCinemaNews] = useState([]);
  const [lifestylesNews, setLifeStylesNews] = useState([]);
  const [healthtipsNews, setHealthTipsNews] = useState([]);
  const [astrologyNews, setAstrologyNews] = useState([]);
  const [terroristNews, setTerroristNews] = useState([]);

  const router = useRouter();

  const fetchCategoryNews = async (categoryName, setter) => {
    const data = await getAllCategories();
    const categories = data?.categories || [];

    const matchedCat = categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!matchedCat?._id) return;

    const res = await getPostsByCategoryId(matchedCat._id);
    const newsList = res?.newsList || [];

    const published = newsList
      .filter(post => post.status === "Published")
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
      .slice(0, 7);

    setter(published);
  };


  useEffect(() => {
    const fetchPostsAndAuthors = async () => {
      const data = await getAllPosts();
      if (data?.newsList) {
        const published = data.newsList
          .filter(post => post.status === "Published")
          .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
          .slice(0, 5);

        setPosts(published);

        const authorIds = [...new Set(published.map(post => post.authorName))];
        const authorResults = await Promise.all(
          authorIds.map(id => getEmployeeById(id))
        );

        const map = {};
        authorIds.forEach((id, i) => {
          map[id] = authorResults[i]?.name || "Unknown";
        });
        setAuthorMap(map);
      }
    };

    fetchPostsAndAuthors();
  }, []);

  useEffect(() => {
    fetchCategoryNews("Breaking News", setBreakingNews);
    fetchCategoryNews("Tamilnadu", setTamilNaduNews);
    fetchCategoryNews("India", setIndiaNews);
    fetchCategoryNews("World", setWorldNews);
    fetchCategoryNews("Sports", setSportsNews);
    fetchCategoryNews("Cinema", setCinemaNews);
    fetchCategoryNews("LifeStyles", setLifeStylesNews);
    fetchCategoryNews("HealthTips", setHealthTipsNews);
    fetchCategoryNews("Astrology", setAstrologyNews);
    fetchCategoryNews("Terrorist", setTerroristNews);
    // Add more: fetchCategoryNews("World", setWorldNews);
  }, []);

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 5);
  return (
    <>
      <div className="home">
        <HomeNavBar
          showsearch={showSearch}
          setShowSearch={setShowSearch}
          navbarOpen={navbarOpen}
          setNavbarOpen={setNavbarOpen}
        />
        <div className='categorybar'>
          <CategoryBar showSearch={showSearch} navbarOpen={navbarOpen} />
        </div>
        <div className="home-content">

          {/* ⭐ Featured Section */}
          <div className="grid-container">
            {mainPost && (
              <div className="main-post" onClick={() => router.push(`/Mainpost?id=${mainPost._id}`)}>
                <img src={mainPost.file} alt={mainPost.title} className="main-image" />
                <div className="main-overlay">
                  <h3 className="main-title">{mainPost.title}</h3>
                  <p className="main-meta">
                    By {authorMap[mainPost.authorName] || "Unknown"} |{" "}
                    {new Date(mainPost.createDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
            )}

            {sidePosts.map((post) => (
              <div key={post._id} className="side-post">
                <div className="text" onClick={() => router.push(`/Mainpost?id=${mainPost._id}`)}>
                  <p className="mini-title">{post.title}</p>
                  <p className="mini-meta">By {authorMap[post.authorName] || "Unknown"}</p>
                </div>
                <img src={post.file} alt={post.title} className="mini-image" />
              </div>
            ))}
          </div>

          {/* 🔴 Breaking News Section */}
          {breakingNews.length > 0 && (
            <div className="breaking-news">
              <h2 className='breakingnews-title'>Breaking News</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${breakingNews[0]?._id}&category=Breaking News`)}>
                  <img src={breakingNews[0]?.file} alt={breakingNews[0]?.title} />
                  <p className="title">{breakingNews[0]?.title}</p>
                </div>
                {breakingNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=Breaking News`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🟢 Tamilnadu News Section */}
          {tamilnaduNews.length > 0 && (
            <div className="breaking-news">
              <h2 className='breakingnews-title'>Tamil Nadu</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${tamilnaduNews[0]._id}&category=Tamilnadu`)}>
                  <img src={tamilnaduNews[0]?.file} alt={tamilnaduNews[0]?.title} />
                  <p className="title">{tamilnaduNews[0]?.title}</p>
                </div>
                {tamilnaduNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=Tamilnadu`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {indiaNews.length > 0 && (
            <div className="breaking-news" >
              <h2 className='breakingnews-title'>India</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${indiaNews[0]._id}&category=India`)}>
                  <img src={indiaNews[0]?.file} alt={indiaNews[0]?.title} />
                  <p className="title">{indiaNews[0]?.title}</p>
                </div>
                {indiaNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=India`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* wolrd news  */}
          {worldNews.length > 0 && (
            <div className="breaking-news">
              <h2 className='breakingnews-title'>World</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${worldNews[0]._id}&category=World`)}>
                  <img src={worldNews[0]?.file} alt={worldNews[0]?.title} />
                  <p className="title">{worldNews[0]?.title}</p>
                </div>
                {worldNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=World`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sportsNews.length > 0 && (
            <div className="breaking-news" >
              <h2 className='breakingnews-title'>Sports</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${sportsNews[0]._id}&category=Sports`)}>
                  <img src={sportsNews[0]?.file} alt={sportsNews[0]?.title} />
                  <p className="title">{sportsNews[0]?.title}</p>
                </div>
                {sportsNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=Sports`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cinemaNews.length > 0 && (
            <div className="breaking-news">
              <h2 className='breakingnews-title'>Cinema</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${cinemaNews[0]._id}&category=Cinema`)}>
                  <img src={cinemaNews[0]?.file} alt={cinemaNews[0]?.title} />
                  <p className="title">{cinemaNews[0]?.title}</p>
                </div>
                {cinemaNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=Cinema`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lifestylesNews.length > 0 && (
            <div className="breaking-news" id="lifestyles">
              <h2 className='breakingnews-title'>LifeStyles</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${lifestylesNews[0]._id}&category=Lifestyles`)}>
                  <img src={lifestylesNews[0]?.file} alt={lifestylesNews[0]?.title} />
                  <p className="title">{lifestylesNews[0]?.title}</p>
                </div>
                {lifestylesNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=Lifestyles`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {healthtipsNews.length > 0 && (
            <div className="breaking-news" >
              <h2 className='breakingnews-title'>Health Tips</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${healthtipsNews[0]._id}&category=Health Tips`)}>
                  <img src={healthtipsNews[0]?.file} alt={healthtipsNews[0]?.title} />
                  <p className="title">{healthtipsNews[0]?.title}</p>
                </div>
                {healthtipsNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=Health Tips`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {astrologyNews.length > 0 && (
            <div className="breaking-news" >
              <h2 className='breakingnews-title'>Astrology</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${astrologyNews[0]._id}&category=Astrology`)}>
                  <img src={astrologyNews[0]?.file} alt={astrologyNews[0]?.title} />
                  <p className="title">{astrologyNews[0]?.title}</p>
                </div>
                {astrologyNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=Astrology`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {terroristNews.length > 0 && (
            <div className="breaking-news">
              <h2 className='breakingnews-title'>Terrorist</h2>
              <div className="breaking-grid">
                <div className="main-breaking" onClick={() => router.push(`/Mainpost?id=${terroristNews[0]._id}&category=Terrorist`)}>
                  <img src={terroristNews[0]?.file} alt={terroristNews[0]?.title} />
                  <p className="title">{terroristNews[0]?.title}</p>
                </div>
                {terroristNews.slice(1, 7).map((news) => (
                  <div key={news._id} className="breaking-card" onClick={() => router.push(`/Mainpost?id=${news._id}&category=Terrorist`)}>
                    <img src={news.file} alt={news.title} className="breaking-img" />
                    <p className="breaking-title">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
