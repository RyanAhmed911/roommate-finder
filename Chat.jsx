import React, { useContext, useEffect, useState, useRef } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'

const Chat = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    
    // File Upload State
    const [attachment, setAttachment] = useState(null)
    const [attachmentPreview, setAttachmentPreview] = useState(null)
    const fileInputRef = useRef(null)

    // Edit State
    const [editingMessageId, setEditingMessageId] = useState(null)
    
    const messagesEndRef = useRef(null)

    const fetchMessages = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/message/all')
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.error("Error fetching messages")
        } finally {
            setLoading(false)
        }
    }

    // Helper: Convert file to Base64
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Check size (5MB = 5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File is too large! Max 5MB.")
            return
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            setAttachment({
                data: reader.result, // Base64 string
                type: file.type
            })
            // Create preview if it's an image
            if (file.type.startsWith('image/')) {
                setAttachmentPreview(reader.result)
            } else {
                setAttachmentPreview(null) // Generic file icon logic could go here
            }
        }
        reader.onerror = error => toast.error("Error reading file")
    }

    const clearAttachment = () => {
        setAttachment(null)
        setAttachmentPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() && !attachment) return

        try {
            axios.defaults.withCredentials = true
            
            if (editingMessageId) {
                // --- UPDATE MODE ---
                const { data } = await axios.put(backendUrl + '/api/message/update', {
                    messageId: editingMessageId,
                    newContent: newMessage
                })
                if (data.success) {
                    setEditingMessageId(null)
                    setNewMessage('')
                    fetchMessages()
                } else {
                    toast.error(data.message)
                }
            } else {
                // --- SEND MODE ---
                const { data } = await axios.post(backendUrl + '/api/message/send', {
                    messageContent: newMessage,
                    attachment: attachment ? attachment.data : "",
                    attachmentType: attachment ? attachment.type : ""
                })

                if (data.success) {
                    setNewMessage('')
                    clearAttachment()
                    fetchMessages()
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteMessage = async (msgId) => {
        if(!confirm("Are you sure you want to delete this message?")) return
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/message/delete', { messageId: msgId })
            if (data.success) fetchMessages()
            else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const startEditing = (msg) => {
        setNewMessage(msg.messageContent)
        setEditingMessageId(msg._id)
        if(fileInputRef.current) fileInputRef.current.focus()
    }

    const cancelEdit = () => {
        setEditingMessageId(null)
        setNewMessage('')
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (userData) {
            fetchMessages()
            const interval = setInterval(fetchMessages, 3000) 
            return () => clearInterval(interval)
        }
    }, [userData])

    return (
        <div className="min-h-screen bg-slate-50 pt-20 flex flex-col">
            <Navbar />
            
            <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-4xl h-[calc(100vh-80px)]">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1 border border-slate-200">
                    
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 text-white shadow-md z-10 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">💬 Group Chat</h2>
                            <p className="text-indigo-200 text-sm">Roommates Only</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {loading && <p className="text-center text-gray-400 mt-10">Loading chat...</p>}
                        
                        {!loading && messages.length === 0 && (
                            <div className="text-center text-gray-400 mt-10"><p>No messages yet.</p></div>
                        )}

                        {messages.map((msg) => {
                            const isMe = msg.sender?._id === userData._id
                            return (
                                <div key={msg._id} className={`flex group ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        
                                        {!isMe && <span className="text-xs text-gray-500 ml-1 mb-1">{msg.sender?.name}</span>}
                                        
                                        <div className="relative">
                                            {/* Message Bubble */}
                                            <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm border ${
                                                msg.isDeleted 
                                                ? 'bg-gray-100 text-gray-500 italic border-gray-200'
                                                : isMe 
                                                    ? 'bg-indigo-600 text-white rounded-br-none border-indigo-600' 
                                                    : 'bg-white text-slate-800 border-gray-200 rounded-bl-none'
                                            }`}>
                                                
                                                {/* Image Attachment Display */}
                                                {!msg.isDeleted && msg.attachment && msg.attachmentType.startsWith('image/') && (
                                                    <img src={msg.attachment} alt="attachment" className="max-w-full h-auto rounded-lg mb-2 border border-white/20" />
                                                )}

                                                {/* Non-Image File Display */}
                                                {!msg.isDeleted && msg.attachment && !msg.attachmentType.startsWith('image/') && (
                                                    <a href={msg.attachment} download="file" className={`flex items-center gap-2 mb-2 p-2 rounded ${isMe ? 'bg-indigo-500' : 'bg-gray-100'}`}>
                                                        📄 <span className="underline">Download File</span>
                                                    </a>
                                                )}

                                                {/* Text Content */}
                                                <p>{msg.messageContent}</p>
                                            </div>

                                            {/* Edit/Delete Controls (Only visible on hover for own messages) */}
                                            {isMe && !msg.isDeleted && (
                                                <div className="absolute top-0 -left-16 hidden group-hover:flex gap-1 bg-white shadow-md p-1 rounded-lg border border-gray-100">
                                                    <button onClick={() => startEditing(msg)} className="p-1 hover:text-indigo-600" title="Edit">✏️</button>
                                                    <button onClick={() => handleDeleteMessage(msg._id)} className="p-1 hover:text-red-600" title="Delete">🗑️</button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Meta Data (Time & Edited Label) */}
                                        <div className="flex items-center gap-1 mt-1 mx-1">
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(msg.sendingTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            {msg.isEdited && !msg.isDeleted && (
                                                <span className="text-[10px] text-slate-400 italic">(edited)</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        {/* File Preview */}
                        {attachment && (
                            <div className="flex items-center gap-2 mb-2 bg-indigo-50 p-2 rounded-lg w-fit">
                                <span className="text-xs font-bold text-indigo-700">📎 File Attached</span>
                                {attachmentPreview && <img src={attachmentPreview} className="h-8 w-8 object-cover rounded" />}
                                <button onClick={clearAttachment} className="text-red-500 text-xs hover:font-bold">✕ Remove</button>
                            </div>
                        )}

                        {/* Edit Mode Indicator */}
                        {editingMessageId && (
                            <div className="flex items-center justify-between bg-orange-50 p-2 rounded-lg mb-2 text-xs text-orange-700 border border-orange-200">
                                <span>Editing message...</span>
                                <button onClick={cancelEdit} className="font-bold hover:underline">Cancel</button>
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                            {/* File Button */}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileChange} 
                                className="hidden" 
                                id="file-upload"
                            />
                            {!editingMessageId && (
                                <label htmlFor="file-upload" className="cursor-pointer p-3 text-slate-400 hover:text-indigo-600 transition-colors" title="Attach File (Max 5MB)">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                </label>
                            )}

                            <input 
                                type="text" 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={editingMessageId ? "Update your message..." : "Type a message..."}
                                className="flex-1 bg-slate-100 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                            
                            <button 
                                type="submit"
                                disabled={!newMessage.trim() && !attachment}
                                className={`p-3 rounded-full text-white transition-colors shadow-lg disabled:opacity-50 ${editingMessageId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                                {editingMessageId ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> // Checkmark
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> // Send plane
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat