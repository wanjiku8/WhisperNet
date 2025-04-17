import { useEffect, useState } from "react";
import API from "../api";

const AdviceFeed = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    API.get("/advice").then((res) => setPosts(res.data));
  }, []);

  const handleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container">
      <h2>Advice Garden</h2>
      {posts.map((post) => (
        <div key={post.id} className="card">
          <p>{post.message}</p>
          <small>#{post.tag}</small>
          <div onClick={() => handleLike(post.id)} style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            {likes[post.id] ? "❤️" : "🤍"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdviceFeed;
