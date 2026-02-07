import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
    <nav style={{ 
        padding: '1rem', 
        backgroundColor: '#333', 
        color: 'white',
        display: 'flex',
        gap: '1rem',
        paddingLeft: '60px',
        paddingRight: '60px',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
        zIndex: 1000
    }}>
        <Link to="/" style={{ color: 'white' }}>Discover</Link>
        <Link to="/inventory" style={{ color: 'white' }}>Inventory</Link>
        <Link to="/scanner" style={{ color: 'white' }}>Scanner</Link>
        <Link to="/cart" style={{ color: 'white' }}>Cart</Link>
        <Link to="/profile" style={{ color: 'white' }}>Profile</Link>
    </nav>
    )
}