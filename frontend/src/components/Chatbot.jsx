import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [language, setLanguage] = useState(null);
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);

  const [chatList, setChatList] = useState([
    {
      message: "👋 Hello! I am Nivesh Mitra.\nPlease choose your language:",
      type: "incoming",
      options: ["English", "हिंदी", "বাংলা", "தமிழ்"],
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const chatboxRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  // 🌐 Language selection
  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setIsLanguageSelected(true);

    let welcomeMsg = "";

    if (lang === "हिंदी") {
      welcomeMsg =
        "नमस्ते! मैं Nivesh Mitra हूँ 😊\nमैं आपको FD समझाने में मदद कर सकता हूँ।";
    } else if (lang === "বাংলা") {
      welcomeMsg =
        "নমস্কার! আমি Nivesh Mitra 😊\nআমি আপনাকে FD বুঝতে সাহায্য করব।";
    } else if (lang === "தமிழ்") {
      welcomeMsg =
        "வணக்கம்! நான் Nivesh Mitra 😊\nநான் FD பற்றி விளக்க உதவுவேன்.";
    } else {
      welcomeMsg =
        "Hello! I am Nivesh Mitra 😊\nI help you understand Fixed Deposits.";
    }

    setChatList((prev) => [
      ...prev,
      { message: lang, type: "outgoing" },
      { message: welcomeMsg, type: "incoming" },
    ]);
  };

  // 📤 Send message
  const handleSend = async () => {
    const trimmedMessage = userInput.trim();
    if (!trimmedMessage) return;

    if (!isLanguageSelected) {
      setChatList((prev) => [
        ...prev,
        { message: "⚠️ Please select a language first 😊", type: "incoming" },
      ]);
      return;
    }

    setChatList((prev) => [
      ...prev,
      { message: trimmedMessage, type: "outgoing" },
    ]);

    setUserInput("");
    scrollToBottom();

    // typing indicator
    setChatList((prev) => [
      ...prev,
      { message: "Typing...", type: "incoming" },
    ]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedMessage,
          language: language || "English",
        }),
      });

      const data = await response.json();

      setChatList((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          message: data.reply,
          type: "incoming",
        };
        return updated;
      });

      scrollToBottom();
    } catch (error) {
      setChatList((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          message: "Oops! Something went wrong.",
          type: "incoming error",
        };
        return updated;
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "55px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot">
        <header>
          <h2>Nivesh Mitra</h2>
        </header>

        <ul className="chatbox" ref={chatboxRef}>
          {chatList.map((chat, idx) => (
            <li key={idx} className={`chat ${chat.type}`}>
              {(chat.type === "incoming" || chat.type === "incoming error") && (
                <span className="material-symbols-outlined">smart_toy</span>
              )}

              <div>
                <p className={chat.type === "incoming error" ? "error" : ""}>
                  {chat.message}
                </p>

                {/* Language buttons */}
                {chat.options && !isLanguageSelected && (
                  <div className="lang-buttons">
                    {chat.options.map((opt, i) => (
                      <button key={i} onClick={() => handleLanguageSelect(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="chat-input">
          <textarea
            ref={textareaRef}
            placeholder="Type your question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span onClick={handleSend} className="material-symbols-outlined">
            send
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;