import { getPostsByCategoryId } from "@/app/services/Api";
import Link from "next/link";
import "../../../Styles/AllPosts.css";

export default async function CategoryPage({ params }) {
  const { id } = params;

  const response = await getPostsByCategoryId(id);
  const posts = response.newsList?.filter(post => post.status === "Published") || [];

  return (
    <div className="posts-container">
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Category News</h1>
      <div className="posts-grid">
        {posts.map((post) => (
          <Link key={post._id} href={`/news/${post._id}`}>
          <div className="post-card" key={post._id}>
            <img src={post.file} alt={post.title} className="post-image" />
            <div className="post-title">{post.title}</div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
