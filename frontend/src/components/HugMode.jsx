import { useState } from "react";
import API from "../api";

const HugMode = () => {
  const [input, setInput] = useState("");
  const [hug, setHug] = useState("");

  const fetchHug = async () => {
    const res = await API.post("/advice/hug", { message: input });
    setHug(res.data.hug);
  };

  return (
    <div className="container">
      <h2>Need a Hug?</h2>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} />
      <button onClick={fetchHug}>Get Comfort</button>
      {hug && (
        <blockquote style={{ marginTop: "1rem", background: "var(--card-bg)", padding: "1rem", borderLeft: "4px solid var(--accent)" }}>
          {hug}
        </blockquote>
      )}
    </div>
  );
};

export default HugMode;
