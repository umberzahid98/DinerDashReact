
import axios from 'axios'
const api = (part) => {
  return `http://localhost:3000/${part}`
}

export const getAllItems = async () => {
  const data = await axios.get(api('items.json'))
  return data.data
}

export const getAllCategories = async () => {
  const data = await axios.get(api('categories.json'))
  return data.data
}

export const getAllOrderItems = async () => {
  const data = await axios.get(api('orders.json'))
  return data.data
}

export const userConfirmedItems = async () => {
  const data = await axios.get(api('users/confirmation.json'))
  return data.data
}

export const updateItems = async (id, body) => {
  const data = await axios.patch(api(`items/${id}.json`), body)
  return data.data
}
export const updateOrders = async (id, body) => {
  const data = await axios.patch(api(`orders/${id}.json`), body)
  return data.data
}

export const getItemById = async (id) => {
  const data = await axios.get(api(`items/${id}.json`))
  return data.data
}

export const getFilteredOrders = async (body) => {
  const data = await axios.get(api('orders.json'), body)
  return data.data
}
