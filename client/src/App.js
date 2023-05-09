import React, { useEffect, useState } from "react";
import send from "./assets/send.svg";
import user from "./assets/user.png";
import loadingIcon from "./assets/loader.svg";
import bot from "./assets/bot.png";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
      document.querySelector(".layout").scrollHeight;
  }, [posts]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      "http://localhost:4000",
      {
        input: input,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };
  const onSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    updatePosts("Loading...", false, true);
    setInput("");
    fetchBotResponse().then((res) => {
      console.log(res);
      updatePosts(res.bot.trim(), true);
    });
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prev) => {
          let lastItem = prev.pop();
          if (lastItem.type !== "bot") {
            prev.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          } else {
            prev.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prev];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    });
  };

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      // console.log(post);
      autoTypingBotResponse(post);
    } else {
      setPosts((prev) => {
        return [
          ...prev,
          {
            type: isLoading ? "loading" : "user",
            post: post,
          },
        ];
      });
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit();
    }
  };

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                post.type === "bot" || post.type === "loading" ? "bot" : ""
              }`}
            >
              <div className="avatar">
                <img
                  src={
                    post.type === "bot" || post.type === "loading" ? bot : user
                  }
                  alt=""
                />
              </div>
              {post.type === "loading" ? (
                <div className="loader">
                  <img src={loadingIcon} alt="" />
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      <footer>
        <input
          type="text"
          value={input}
          className="composebar"
          autoFocus
          placeholder="Ask me Anything!"
          onKeyUp={onKeyUp}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="" />
        </div>
      </footer>
    </main>
  );
}

export default App;
