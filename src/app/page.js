'use client';
import React, { useState, useEffect, useRef } from 'react';
import HomeNavBar from './components/HomeNavBar';
import {
  getAllPosts,
  getEmployeeById,
  getAllCategories,
  getPostsByCategoryId
} from './services/Api';
import './styles/Home.css';

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
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
  const [activeCategory, setActiveCategory] = useState("home");
  const refs = {
    breaking: useRef(null),
    tamilnadu: useRef(null),
    india: useRef(null),
    world: useRef(null),
    sports: useRef(null),
    cinema: useRef(null),
    lifestyles: useRef(null),
    healthtips: useRef(null),
    astrology: useRef(null),
    terrorist: useRef(null),
  };
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
          .slice(0, 4);

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
    const handleScroll = () => {
      const offset = window.innerHeight / 2;
      for (let key in refs) {
        const ref = refs[key];
        const top = ref.current?.getBoundingClient().top;
        if (top >= 0 && top < offset) {
          setActiveCategory(key);
          break;
        }
      }
    }
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
  const sidePosts = posts.slice(1, 4);

  return (
    <div className="home">
      <HomeNavBar showSearch={showSearch} setShowSearch={setShowSearch} activeCategory={activeCategory} />
      <div className="home-content">

        {/* ⭐ Featured Section */}
        <div className="grid-container">
          {mainPost && (
            <div className="main-post">
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
              <div className="text">
                <p className="mini-title">{post.title}</p>
                <p className="mini-meta">By {authorMap[post.authorName] || "Unknown"}</p>
              </div>
              <img src={post.file} alt={post.title} className="mini-image" />
            </div>
          ))}
        </div>

        {/* 🔴 Breaking News Section */}
        {breakingNews.length > 0 && (
          <div className="breaking-news" id="breaking-news" ref={refs.breaking}>
            <h2 className='breakingnews-title'>Breaking News</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={breakingNews[0]?.file} alt={breakingNews[0]?.title} />
                <p className="title">{breakingNews[0]?.title}</p>
              </div>
              {breakingNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🟢 Tamilnadu News Section */}
        {tamilnaduNews.length > 0 && (
          <div className="breaking-news" id="tamilnadu" ref={refs.tamilnadu}>
            <h2 className='breakingnews-title'>Tamil Nadu</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={tamilnaduNews[0]?.file} alt={tamilnaduNews[0]?.title} />
                <p className="title">{tamilnaduNews[0]?.title}</p>
              </div>
              {tamilnaduNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {indiaNews.length > 0 && (
          <div className="breaking-news" id="india" ref={refs.india}>
            <h2 className='breakingnews-title'>India</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={indiaNews[0]?.file} alt={indiaNews[0]?.title} />
                <p className="title">{indiaNews[0]?.title}</p>
              </div>
              {indiaNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* wolrd news  */}
        {worldNews.length > 0 && (
          <div className="breaking-news" id="world" ref={refs.world}>
            <h2 className='breakingnews-title'>World</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={worldNews[0]?.file} alt={worldNews[0]?.title} />
                <p className="title">{worldNews[0]?.title}</p>
              </div>
              {worldNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {sportsNews.length > 0 && (
          <div className="breaking-news" id="sports" ref={refs.sports}>
            <h2 className='breakingnews-title'>Sports</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={sportsNews[0]?.file} alt={sportsNews[0]?.title} />
                <p className="title">{sportsNews[0]?.title}</p>
              </div>
              {sportsNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {cinemaNews.length > 0 && (
          <div className="breaking-news" id="cinema" ref={refs.cinema}>
            <h2 className='breakingnews-title'>Cinema</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={cinemaNews[0]?.file} alt={cinemaNews[0]?.title} />
                <p className="title">{cinemaNews[0]?.title}</p>
              </div>
              {cinemaNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {lifestylesNews.length > 0 && (
          <div className="breaking-news" id="lifestyles" ref={refs.lifesetyles}>
            <h2 className='breakingnews-title'>LifeStyles</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={lifestylesNews[0]?.file} alt={lifestylesNews[0]?.title} />
                <p className="title">{lifestylesNews[0]?.title}</p>
              </div>
              {lifestylesNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {healthtipsNews.length > 0 && (
          <div className="breaking-news" id="health-tips" ref={healthtips}>
            <h2 className='breakingnews-title'>Health Tips</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={healthtipsNews[0]?.file} alt={healthtipsNews[0]?.title} />
                <p className="title">{healthtipsNews[0]?.title}</p>
              </div>
              {healthtipsNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {astrologyNews.length > 0 && (
          <div className="breaking-news" id="astrology" ref={refs.astrology}>
            <h2 className='breakingnews-title'>Astrology</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={astrologyNews[0]?.file} alt={astrologyNews[0]?.title} />
                <p className="title">{astrologyNews[0]?.title}</p>
              </div>
              {astrologyNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {terroristNews.length > 0 && (
          <div className="breaking-news" id="terrorist" ref={refs.terrorist}>
            <h2 className='breakingnews-title'>Terrorist</h2>
            <div className="breaking-grid">
              <div className="main-breaking">
                <img src={terroristNews[0]?.file} alt={terroristNews[0]?.title} />
                <p className="title">{terroristNews[0]?.title}</p>
              </div>
              {terroristNews.slice(1, 7).map((news) => (
                <div key={news._id} className="breaking-card">
                  <img src={news.file} alt={news.title} className="breaking-img" />
                  <p className="breaking-title">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
