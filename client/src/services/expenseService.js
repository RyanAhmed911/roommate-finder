import axios from 'axios'

axios.defaults.withCredentials = true

export const fetchMyRoom = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}/api/room/my-rooms`)
  return data
}

export const fetchRoomExpenses = async (backendUrl, roomId) => {
  const { data } = await axios.get(`${backendUrl}/api/expense/${roomId}`)
  return data
}

export const addExpense = async (backendUrl, expense) => {
  const { data } = await axios.post(`${backendUrl}/api/expense/add`, expense)
  return data
}

export const deleteExpenseById = async (backendUrl, expenseId) => {
  const { data } = await axios.delete(`${backendUrl}/api/expense/${expenseId}`)
  return data
}

export const toggleExpenseStatusById = async (backendUrl, expenseId) => {
  const { data } = await axios.post(`${backendUrl}/api/expense/toggle-status`, { expenseId })
  return data
}
//Added by Nusayba