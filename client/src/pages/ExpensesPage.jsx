import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ExpensesPage = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()
    const [room, setRoom] = useState(null)
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    // Form States
    const [title, setTitle] = useState('')
    const [type, setType] = useState('Utilities')
    const [amount, setAmount] = useState('')
    const [dueDate, setDueDate] = useState('')

    // 1. Fetch Room Data first
    const fetchRoomAndExpenses = async () => {
        try {
            axios.defaults.withCredentials = true
            // Get Room ID
            const { data: roomData } = await axios.get(backendUrl + '/api/room/my-rooms')
            
            if (roomData.success && roomData.rooms.length > 0) {
                const myRoom = roomData.rooms[0]
                setRoom(myRoom)
                
                // Get Expenses for this Room
                const { data: expenseData } = await axios.get(backendUrl + `/api/expense/${myRoom._id}`)
                if (expenseData.success) {
                    setExpenses(expenseData.expenses)
                }
            } else {
                toast.error("You need to be in a room to view expenses.")
                navigate('/my-room')
            }
        } catch (error) {
            toast.error("Failed to load data")
        } finally {
            setLoading(false)
        }
    }

    // Add Expense
    const handleAddExpense = async (e) => {
        e.preventDefault()
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/expense/add', {
                roomId: room._id, title, type, amount, dueDate
            })

            if (data.success) {
                toast.success('Expense Added')
                setShowForm(false)
                setTitle('')
                setAmount('')
                setDueDate('')
                fetchRoomAndExpenses() // Refresh list
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Delete Expense
    const handleDelete = async (expenseId) => {
        if (!window.confirm('Delete this expense?')) return
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.delete(backendUrl + `/api/expense/${expenseId}`)
            if (data.success) {
                toast.success('Expense Deleted')
                fetchRoomAndExpenses()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Toggle Paid Status
    const toggleStatus = async (expenseId) => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/expense/toggle-status', { expenseId })
            if (data.success) {
                fetchRoomAndExpenses()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (userData) {
            fetchRoomAndExpenses()
        }
    }, [userData, backendUrl])

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            
            <div className="container mx-auto px-4 py-10 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/my-room')} 
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Room Expenses</h1>
                            <p className="text-slate-500">Track and split bills with your roommates</p>
                        </div>
                    </div>
                    
                    {!showForm && (
                        <button 
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Add Bill
                        </button>
                    )}
                </div>

                {/* Add Form Card */}
                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 mb-8 animate-fadeIn">
                        <h3 className="font-bold text-lg text-slate-800 mb-6">Add New Expense</h3>
                        <form onSubmit={handleAddExpense} className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                                    <input type="text" placeholder="e.g. Internet Bill" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" value={title} onChange={e => setTitle(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" value={type} onChange={e => setType(e.target.value)}>
                                        <option>Utilities</option>
                                        <option>Food</option>
                                        <option>Maintenance</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount (BDT)</label>
                                    <input type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" value={amount} onChange={e => setAmount(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Due Date</label>
                                    <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-2 justify-end">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-colors">Save Expense</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Expenses List */}
                {expenses.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-200">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💰</div>
                        <h3 className="text-xl font-bold text-slate-800">No expenses yet</h3>
                        <p className="text-slate-500">Add a bill to start tracking shared costs.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {expenses.map((expense) => (
                            <div key={expense._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                                        expense.type === 'Food' ? 'bg-orange-100 text-orange-600' : 
                                        expense.type === 'Utilities' ? 'bg-blue-100 text-blue-600' : 
                                        expense.type === 'Maintenance' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                        {expense.type === 'Food' ? '🍔' : expense.type === 'Utilities' ? '⚡' : expense.type === 'Maintenance' ? '🛠️' : '💰'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800">{expense.title}</h4>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <span>{new Date(expense.dueDate).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>Added by {expense.createdBy?.name || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-slate-800">৳ {expense.amount}</p>
                                        <button 
                                            onClick={() => toggleStatus(expense._id)}
                                            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${expense.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {expense.status}
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(expense._id)} 
                                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Delete Expense"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExpensesPage