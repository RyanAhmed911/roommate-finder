import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {fetchMyRoom,fetchRoomExpenses,addExpense,deleteExpenseById,toggleExpenseStatusById} from '../services/expenseService'

const ExpensesPage = () => {
  const { backendUrl, userData } = useContext(AppContent)
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Utilities')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [deleteExpenseId, setDeleteExpenseId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const fetchRoomAndExpenses = async () => {
    setLoading(true)
    try {
      const roomData = await fetchMyRoom(backendUrl)

      if (!roomData.success || roomData.rooms.length === 0) {
        toast.error('You need to be in a room to view expenses.')
        navigate('/my-room')
        return
      }

      const myRoom = roomData.rooms[0]
      setRoom(myRoom)

      const expenseData = await fetchRoomExpenses(backendUrl, myRoom._id)
      if (expenseData.success) setExpenses(expenseData.expenses)
      else toast.error(expenseData.message)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    if (!room) return

    try {
      const { success, message } = await addExpense(backendUrl, {
        roomId: room._id, title, type, amount,dueDate
      })

      if (success) {
        toast.success('Expense added')
        setShowForm(false)
        resetForm()
        fetchRoomAndExpenses()
      } else toast.error(message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setTitle('')
    setType('Utilities')
    setAmount('')
    setDueDate('')
  }

  const openDeleteModal = (expenseId) => {
    setDeleteExpenseId(expenseId)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteExpenseId) return

    try {
      const { success, message } = await deleteExpenseById(backendUrl, deleteExpenseId)
      if (success) {
        toast.success('Deleted')
        fetchRoomAndExpenses()
      } else toast.error(message)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setShowDeleteModal(false)
      setDeleteExpenseId(null)
    }
  }

  const toggleStatus = async (expenseId) => {
    try {
      const { success, message } = await toggleExpenseStatusById(backendUrl, expenseId)
      if (success) fetchRoomAndExpenses()
      else toast.error(message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    if (userData) fetchRoomAndExpenses()
  }, [userData, backendUrl])

  if (loading) return (
    <div className="min-h-screen bg-[#08101C] flex items-center justify-center text-white">
      Loading...
    </div>
  )

  return (
    <div className="min-h-screen bg-[#08101C] pt-20">
      <Navbar />

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        
        <Header showForm={showForm} setShowForm={setShowForm} navigate={navigate} />

        {showForm && (
          <AddExpenseForm
            title={title} setTitle={setTitle}
            type={type} setType={setType}
            amount={amount} setAmount={setAmount}
            dueDate={dueDate} setDueDate={setDueDate}
            handleAddExpense={handleAddExpense}
            setShowForm={setShowForm}
          />
        )}

        <ExpensesList
          expenses={expenses}
          toggleStatus={toggleStatus}
          openDeleteModal={openDeleteModal}
        />

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-2xl p-6 w-80 text-center shadow-lg border border-slate-700">
              <h2 className="text-white font-bold text-lg mb-4">Delete this expense?</h2>
              <p className="text-slate-400 mb-6">This action cannot be undone.</p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const Header = ({ showForm, setShowForm, navigate }) => (
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-4">
    
      <button
        onClick={() => navigate('/my-room')}
        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
      >
        <svg
          className="w-5 h-5 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <div>
        <h1 className="text-3xl font-bold text-white">Room Expenses</h1>
        <p className="text-slate-400">Track and split bills with your roommates</p>
      </div>
    </div>

    {!showForm && (
      <button
        onClick={() => setShowForm(true)}
        className="px-6 py-2.5 bg-indigo-900 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
      >
        Add Expense
      </button>
    )}
  </div>
)

const AddExpenseForm = ({ title, setTitle, type, setType, amount, setAmount, dueDate, setDueDate, handleAddExpense, setShowForm }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-lg p-6 mb-8 animate-fadeIn">
    <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500" required />
      <select value={type} onChange={e => setType(e.target.value)}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500">
        <option>Utilities</option>
        <option>Food</option>
        <option>Maintenance</option>
        <option>Other</option>
      </select>
      <input type="number" placeholder="Amount (BDT)" value={amount} onChange={e => setAmount(e.target.value)}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500" required />
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500" required />
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => setShowForm(false)}
          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Save
        </button>
      </div>
    </form>
  </div>
)

const ExpensesList = ({ expenses, toggleStatus, openDeleteModal }) => {
  if (expenses.length === 0)
    return <div className="text-slate-400 text-center py-10">No expenses yet</div>

  return (
    <div className="grid gap-4">
      {expenses.map(expense => (
        <div key={expense._id} className="bg-slate-900 border border-slate-700 rounded-2xl p-5 flex justify-between items-center shadow-sm">
          <div className="flex flex-col gap-1">
            <h4 className="text-white font-bold text-lg">{expense.title}</h4>
            <p className="text-slate-400 text-sm">{expense.type}</p>
            <p className="text-slate-400 text-sm">Due: {new Date(expense.dueDate).toLocaleDateString()}</p>
            <p className="text-slate-400 text-sm">Added by: {expense.createdBy?.name || 'Unknown'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleStatus(expense._id)}
              className={`px-3 py-1 rounded-full font-bold text-xs ${expense.status === 'Paid'
                ? 'bg-green-900/30 text-green-400 border border-green-800'
                : 'bg-amber-900/30 text-amber-400 border border-amber-800'}`}>
              {expense.status}
            </button>
            <button onClick={() => openDeleteModal(expense._id)}
              className="px-3 py-1 rounded-full font-bold text-xs bg-red-900/20 text-red-500 border border-red-800 hover:bg-red-600 hover:text-white transition-colors">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExpensesPage