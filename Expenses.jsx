import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'

const Expenses = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(false)

    // Form states
    const [type, setType] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState('')
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)

    const fetchExpenses = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/expense/my-expenses')
            if (data.success) {
                setExpenses(data.expenses)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const resetForm = () => {
        setType('')
        setAmount('')
        setDate('')
        setIsEditing(false)
        setEditId(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            axios.defaults.withCredentials = true
            let response;

            if (isEditing) {
                // UPDATE LOGIC
                response = await axios.put(backendUrl + '/api/expense/update', {
                    expenseId: editId,
                    type,
                    amount,
                    date
                })
            } else {
                // ADD LOGIC
                response = await axios.post(backendUrl + '/api/expense/add', {
                    type,
                    amount,
                    date
                })
            }

            const { data } = response;

            if (data.success) {
                toast.success(data.message)
                resetForm()
                fetchExpenses()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (item) => {
        setType(item.type)
        setAmount(item.amount)
        // Format date for input field (YYYY-MM-DD)
        const formattedDate = new Date(item.date).toISOString().split('T')[0]
        setDate(formattedDate)
        
        setEditId(item._id)
        setIsEditing(true)
        
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id) => {
        if(!confirm("Delete this expense?")) return;
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/expense/delete', { expenseId: id })
            if (data.success) {
                toast.success("Deleted")
                fetchExpenses()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (userData) {
            fetchExpenses()
        }
    }, [userData])

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0)

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            <div className="container mx-auto px-4 py-10 max-w-4xl">
                <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">Expense Tracker</h1>
                <p className="text-center text-slate-500 mb-8">Manage shared costs with your roommates</p>

                {/* --- Input Form --- */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 mb-8 transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-indigo-600">
                            {isEditing ? 'Edit Expense' : 'Add New Expense'}
                        </h3>
                        {isEditing && (
                            <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">Cancel Edit</button>
                        )}
                    </div>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                        <input 
                            type="text" 
                            placeholder="Expense Name (e.g. Electricity)" 
                            value={type} 
                            onChange={e => setType(e.target.value)}
                            required
                            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                        />
                        <input 
                            type="number" 
                            placeholder="Amount" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)}
                            required
                            className="w-full md:w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                        />
                        <input 
                            type="date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)}
                            required
                            className="w-full md:w-auto p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                        />
                        <button 
                            disabled={loading}
                            className={`px-6 py-3 rounded-xl font-bold text-white transition-colors shadow-lg ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                            {loading ? 'Processing...' : isEditing ? 'Update' : 'Add +'}
                        </button>
                    </form>
                </div>

                {/* --- Expense List --- */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Recent Expenses</h3>
                        <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold">
                            Total: ৳ {totalExpense}
                        </span>
                    </div>
                    
                    {expenses.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">No expenses recorded yet.</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {expenses.map((item) => (
                                <div key={item._id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                            ৳
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{item.type}</p>
                                            <p className="text-xs text-slate-500">
                                                Paid by <span className="text-indigo-500 font-medium">{item.user?.name || 'Unknown'}</span> • {new Date(item.date).toDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-slate-700">৳ {item.amount}</span>
                                        
                                        {/* ONLY SHOW BUTTONS IF CURRENT USER OWNS THIS EXPENSE */}
                                        {userData && item.user && userData._id === item.user._id && (
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => handleEditClick(item)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                                    title="Edit">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                    title="Delete">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Expenses