import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Discover from './pages/discover'
import Inventory from './pages/inventory'
import Scanner from './pages/scanner'
import Cart from './pages/cart'
import Profile from './pages/profile'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />  {/* Navbar is outside Routes, so it shows on every page */}
      <div style={{ marginTop: '4rem' }}>
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}