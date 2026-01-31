import { useState, useRef, useEffect } from "react";
import axiosClient from "../axios-client";

export default function ChatAI() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Halo! Saya Probmax AI 🤖. Ada yang bisa saya bantu terkait kesehatan mentalmu hari ini?", sender: "bot" }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (ev) => {
        ev.preventDefault();
        if (!newMessage.trim()) return;

        const userMsg = { id: Date.now(), text: newMessage, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setNewMessage("");
        setIsTyping(true);

        axiosClient.post('/chat-ai', { 
            message: newMessage,
            history: messages.slice(-10) // Send last 10 messages for context
        })
            .then(({ data }) => {
                const botMsg = { id: Date.now() + 1, text: data.message, sender: "bot" };
                setMessages(prev => [...prev, botMsg]);
                setIsTyping(false);
            })
            .catch(err => {
                console.error(err);
                setIsTyping(false);
                const errorMsg = { id: Date.now() + 1, text: "Maaf, saya sedang mengalami gangguan koneksi. Coba lagi nanti ya.", sender: "bot" };
                setMessages(prev => [...prev, errorMsg]);
            });
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] flex flex-col px-2 sm:px-0">
            <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200 p-4 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shadow-sm border border-primary/5">🤖</div>
                    <div className="min-w-0">
                        <h1 className="font-bold text-gray-800 text-sm sm:text-base truncate">LiveChat AI</h1>
                        <p className="text-[10px] text-primary font-bold flex items-center gap-1 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 block animate-pulse"></span> Online
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-gray-50/50 p-4 overflow-y-auto space-y-4 border-x border-gray-200 scrollbar-thin scrollbar-thumb-gray-200">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${
                            msg.sender === "user" 
                            ? "bg-primary text-white rounded-br-none shadow-primary/20" 
                            : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                         <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-3 sm:p-4 border border-t-0 border-gray-200 rounded-b-2xl shadow-sm shrink-0">
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Ketik pesanmu disini..." 
                        className="flex-1 bg-gray-100 border-0 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder-gray-400 text-sm"
                    />
                    <button 
                        type="submit"
                        disabled={!newMessage.trim() || isTyping}
                        className="bg-primary hover:bg-primary-dark disabled:bg-gray-200 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95 shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                             <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
                <p className="text-center text-[9px] text-gray-400 mt-2 font-medium">
                    *Bot ini memberikan saran umum, bukan pengganti konsultasi profesional.
                </p>
            </div>
        </div>
    )
}
