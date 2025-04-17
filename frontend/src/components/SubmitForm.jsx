import { useState } from "react";
import API from "../api";

const SubmitForm = () => {
  const [message, setMessage] = useState("");
  const [tag, setTag] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/advice", { message, tag });
    setMessage("");
    setTag("");
    window.location.reload();
  };

  return (
    <div className="container">
      <h2>Whisper Something</h2>
      <form onSubmit={handleSubmit}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What's on your heart?" rows={5} />
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">Choose a tag</option>
          <option value="identity">Identity</option>
          <option value="relationships">Relationships</option>
          <option value="family">Family</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SubmitForm;
