import React, { useState, useRef, useEffect } from "react";

const ChatBot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, open]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMessage: { sender: "user" | "bot"; text: string } = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Hey this is suibiz ai, we are still working." },
            ]);
        }, 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <>
            {/* Chatbot Button */}
            <button
                onClick={() => setOpen(true)}
                style={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 1000,
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    fontSize: 28,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                }}
                aria-label="Open AI Chatbot"
            >
                💬
            </button>

            {/* Side Popup Chat */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        height: "100vh",
                        width: 350,
                        maxWidth: "100vw",
                        background: "#fff",
                        boxShadow: "-2px 0 16px rgba(0,0,0,0.15)",
                        zIndex: 1100,
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.3s",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: "16px",
                            borderBottom: "1px solid #e5e7eb",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#2563eb",
                            color: "#fff",
                        }}
                    >
                        <span>SUIBIZ AI</span>
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#fff",
                                fontSize: 22,
                                cursor: "pointer",
                            }}
                            aria-label="Close Chatbot"
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "16px",
                            background: "#f3f4f6",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        {messages.length === 0 && (
                            <div style={{ color: "#6b7280", textAlign: "center" }}>
                                How can I help you today?
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                    background: msg.sender === "user" ? "#2563eb" : "#e5e7eb",
                                    color: msg.sender === "user" ? "#fff" : "#111827",
                                    padding: "8px 14px",
                                    borderRadius: 16,
                                    maxWidth: "80%",
                                    fontSize: 15,
                                    wordBreak: "break-word",
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: "12px 16px",
                            borderTop: "1px solid #e5e7eb",
                            background: "#fff",
                            display: "flex",
                            gap: "8px",
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="text-black"
                            style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "1px solid #d1d5db",
                                fontSize: 15,
                                outline: "none",
                            }}
                        />
                        <button
                            onClick={handleSend}
                            style={{
                                background: "#2563eb",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                padding: "0 16px",
                                fontSize: 15,
                                cursor: "pointer",
                            }}
                            disabled={!input.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;