import './App.css'
import { Navbar } from './components/navbar/navbar'
import { ItemComponent } from './components/item/item'
import ShowItem from './components/showItem/showItem'
import Orders from './components/orders/orders'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App () {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<ItemComponent />} />
        <Route path='/items/:id' element={<ShowItem />} />
        <Route path='/orders' element={<Orders />} />
      </Routes>
    </Router>
  )
}
export default App
