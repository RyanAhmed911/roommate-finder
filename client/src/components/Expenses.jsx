import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'

const Expenses = ({ roomId, onClose }) => {
    const { backendUrl } = useContext(AppContent)
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    // Form States
    const [title, setTitle] = useState('')
    const [type, setType] = useState('Utilities')
    const [amount, setAmount] = useState('')
    const [dueDate, setDueDate] = useState('')

    // Fetch Expenses
    const fetchExpenses = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + `/api/expense/${roomId}`)
            if (data.success) {
                setExpenses(data.expenses)
            }
        } catch (error) {
            toast.error(error.message)
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
                roomId, title, type, amount, dueDate
            })

            if (data.success) {
                toast.success('Expense Added')
                setShowForm(false)
                setTitle('')
                setAmount('')
                setDueDate('')
                fetchExpenses() // Refresh list
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Delete Expense
    const handleDelete = async (expenseId) => {
        if (!confirm('Delete this expense?')) return
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.delete(backendUrl + `/api/expense/${expenseId}`)
            if (data.success) {
                toast.success('Expense Deleted')
                fetchExpenses()
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
                fetchExpenses()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [roomId])

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        💰 Room Expenses
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
                    
                    {/* Add Button */}
                    {!showForm && (
                        <button 
                            onClick={() => setShowForm(true)}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md mb-6 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Add New Bill
                        </button>
                    )}

                    {/* Add Form */}
                    {showForm && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 animate-fadeIn">
                            <h3 className="font-bold text-slate-700 mb-4">Add New Expense</h3>
                            <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                                    <input type="text" placeholder="e.g. Internet Bill" className="w-full p-2 border rounded-lg" value={title} onChange={e => setTitle(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
                                        <input type="number" placeholder="0.00" className="w-full p-2 border rounded-lg" value={amount} onChange={e => setAmount(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Due Date</label>
                                        <input type="date" className="w-full p-2 border rounded-lg" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                                    <select className="w-full p-2 border rounded-lg" value={type} onChange={e => setType(e.target.value)}>
                                        <option>Utilities</option>
                                        <option>Food</option>
                                        <option>Maintenance</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-200 rounded-lg font-bold text-gray-700">Cancel</button>
                                    <button type="submit" className="flex-1 py-2 bg-indigo-600 rounded-lg font-bold text-white">Save</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* List */}
                    {loading ? <p className="text-center text-slate-500">Loading expenses...</p> : (
                        expenses.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <p>No expenses recorded yet.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {expenses.map((expense) => (
                                    <div key={expense._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${expense.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {expense.type === 'Food' ? '🍔' : expense.type === 'Utilities' ? '⚡' : '💰'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{expense.title}</h4>
                                                <p className="text-xs text-slate-500">
                                                    Due: {new Date(expense.dueDate).toLocaleDateString()} • by {expense.createdBy?.name || 'Unknown'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-slate-800">৳{expense.amount}</p>
                                                <button 
                                                    onClick={() => toggleStatus(expense._id)}
                                                    className={`text-xs font-bold px-2 py-0.5 rounded ${expense.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {expense.status}
                                                </button>
                                            </div>
                                            <button onClick={() => handleDelete(expense._id)} className="text-slate-300 hover:text-red-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default Expenses