import { Sparkles, Store, Check } from "lucide-react"

const walmartItems = [
  { name: "Organic Milk (1 gal)", price: 4.99 },
  { name: "Baby Spinach (5oz)", price: 2.49 },
  { name: "Chicken Breast (2 lb)", price: 8.99 },
  { name: "Sourdough Bread", price: 3.49 },
]

const krogerItems = [
  { name: "Coconut Milk (13.5oz)", price: 1.79 },
  { name: "Thai Basil (bunch)", price: 1.29 },
]

const totalSaved = 14.2
const walmartTotal = walmartItems.reduce((s, i) => s + i.price, 0)
const krogerTotal = krogerItems.reduce((s, i) => s + i.price, 0)
const grandTotal = walmartTotal + krogerTotal

export default function Cart() {
  return (
    <div style={{ padding: '1.5rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Smarter Cart</h1>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>AI-optimized price comparison</p>
      </div>

      {/* Price Agent Header */}
      <div style={{
        borderRadius: '1rem',
        backgroundColor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        padding: '1rem',
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255,255,255,0.5)'
      }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '0.75rem',
          backgroundColor: '#3b82f6',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Price Agent Summary</h3>
          <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: '1.5' }}>
            {"I've optimized your cart. You are saving "}
            <span style={{ fontWeight: 'bold', color: '#8B7355' }}>${totalSaved.toFixed(2)}</span>
            {" by splitting your order across 2 stores."}
          </p>
        </div>
      </div>

      {/* Savings Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderRadius: '9999px',
          backgroundColor: '#f0f4f0',
          padding: '0.5rem 1.25rem'
        }}>
          <Check style={{ width: '1rem', height: '1rem', color: '#8B7355' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#8B7355' }}>
            ${totalSaved.toFixed(2)} saved vs single-store
          </span>
        </div>
      </div>

      {/* Walmart Section */}
      <div style={{
        borderRadius: '1rem',
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#dbeafe',
          padding: '0.75rem 1rem'
        }}>
          <Store style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#3b82f6' }}>Walmart</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#666' }}>{walmartItems.length} items</span>
        </div>
        <div>
          {walmartItems.map((item, idx) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderBottom: idx !== walmartItems.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}
            >
              <span style={{ fontSize: '0.875rem' }}>{item.name}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: '#f3f4f6'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Subtotal</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>${walmartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Kroger Section */}
      <div style={{
        borderRadius: '1rem',
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#f0f4f0',
          padding: '0.75rem 1rem'
        }}>
          <Store style={{ width: '1rem', height: '1rem', color: '#8B7355' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#8B7355' }}>Kroger</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#666' }}>{krogerItems.length} items</span>
        </div>
        <div>
          {krogerItems.map((item, idx) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderBottom: idx !== krogerItems.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}
            >
              <span style={{ fontSize: '0.875rem' }}>{item.name}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: '#f3f4f6'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Subtotal</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>${krogerTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div style={{
        borderRadius: '1rem',
        backgroundColor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(255,255,255,0.5)',
        marginBottom: '1.5rem'
      }}>
        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>Grand Total</span>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#8B7355' }}>${grandTotal.toFixed(2)}</span>
      </div>

      {/* Checkout CTA */}
      <button
        type="button"
        style={{
          width: '100%',
          borderRadius: '1rem',
          backgroundColor: '#3b82f6',
          padding: '1rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#fff',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Execute Order
      </button>
    </div>
  )
}