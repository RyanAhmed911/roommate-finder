import React, { useContext, useEffect, useState, useRef } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const GroupChat = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState([])
    const [text, setText] = useState("")
    const messagesEndRef = useRef(null)

    useEffect(() => {
        const init = async () => {
            try {
                axios.defaults.withCredentials = true

                const roomRes = await axios.get(backendUrl + '/api/room/my-rooms')
                if (!roomRes.data.success || roomRes.data.rooms.length === 0) {
                    toast.error("You need a room first")
                    return navigate('/my-room')
                }

                const msgRes = await axios.get(backendUrl + '/api/messages')
                if (msgRes.data.success) {
                    setMessages(msgRes.data.messages)
                }
            } catch {
                toast.error("Failed to load chat")
                navigate('/my-room')
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [backendUrl, navigate])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = async () => {
        if (!text.trim()) return

        try {
            const { data } = await axios.post(backendUrl + '/api/messages', { text })
            if (data.success) {
                setMessages(prev => [...prev, data.message])
                setText("")
            }
        } catch {
            toast.error("Message failed to send")
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-[#08101C] flex items-center justify-center text-white">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-[#08101C] pt-20">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/my-room')}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                    >
                        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Group Chat</h1>
                        <p className="text-sm text-slate-400">Chat with your roommates</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-lg flex flex-col h-[70vh]">
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {messages.map(msg => {
                            const isMe = msg.sender._id === userData._id
                            return (
                                <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl text-sm shadow
                                        ${isMe 
                                            ? "bg-indigo-600 text-white rounded-br-none" 
                                            : "bg-slate-800 text-slate-200 rounded-bl-none"
                                        }`}
                                    >
                                        {!isMe && (
                                            <p className="text-xs font-bold text-indigo-400 mb-1">
                                                {msg.sender.name}
                                            </p>
                                        )}
                                        {msg.text}
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="border-t border-slate-700 p-4 flex gap-3">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-xl outline-none focus:border-indigo-500"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl font-bold transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupChat