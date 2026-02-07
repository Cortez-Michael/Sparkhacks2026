import { Search, Plus, AlertTriangle, TrendingDown } from "lucide-react"

const inventoryItems = [
  { name: "Organic Milk", quantity: "Half Full", daysRemaining: 2, category: "Dairy" },
  { name: "Free-Range Eggs", quantity: "6 left", daysRemaining: 8, category: "Dairy" },
  { name: "Baby Spinach", quantity: "3/4 Bag", daysRemaining: 1, category: "Produce" },
  { name: "Chicken Breast", quantity: "1 lb", daysRemaining: 3, category: "Protein" },
  { name: "Greek Yogurt", quantity: "Full", daysRemaining: 12, category: "Dairy" },
  { name: "Avocados", quantity: "2 left", daysRemaining: 4, category: "Produce" },
  { name: "Sourdough Bread", quantity: "Half Loaf", daysRemaining: 0, category: "Bakery" },
  { name: "Bell Peppers", quantity: "3 left", daysRemaining: 6, category: "Produce" },
]

const predictedRunOut = [
  { name: "Butter", predictedDate: "In 2 days" },
  { name: "Orange Juice", predictedDate: "Tomorrow" },
  { name: "Rice", predictedDate: "In 4 days" },
]

function FreshnessGauge() {
  const percentage = 72
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative', width: '9rem', height: '9rem' }}>
        <svg style={{ width: '9rem', height: '9rem', transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#8B7355"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'all 1s' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{percentage}%</span>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>Fresh</span>
        </div>
      </div>
      <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#666' }}>Freshness Health</p>
    </div>
  )
}

function DaysTag({ days }) {
  if (days === 0) {
    return (
      <span style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '0.125rem 0.625rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#ef4444'
      }}>
        <AlertTriangle style={{ width: '0.75rem', height: '0.75rem' }} />
        Expiring Today
      </span>
    )
  }
  if (days <= 2) {
    return (
      <span style={{
        borderRadius: '9999px',
        backgroundColor: '#fef3c7',
        padding: '0.125rem 0.625rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#b45309'
      }}>
        {days}d left
      </span>
    )
  }
  return (
    <span style={{
      borderRadius: '9999px',
      backgroundColor: '#f0f4f0',
      padding: '0.125rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#8B7355'
    }}>
      {days}d left
    </span>
  )
}

export default function Inventory() {
  return (
    <div style={{ padding: '1.5rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Live Fridge</h1>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>Your digital pantry twin</p>
        </div>
        <button
          type="button"
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            backgroundColor: '#8B7355',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </div>

      {/* Freshness Gauge */}
      <div style={{
        borderRadius: '1rem',
        backgroundColor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.5)',
        marginBottom: '1.5rem'
      }}>
        <FreshnessGauge />
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search style={{
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          width: '1rem',
          height: '1rem',
          transform: 'translateY(-50%)',
          color: '#666'
        }} />
        <input
          type="text"
          placeholder="Search your inventory..."
          readOnly
          style={{
            width: '100%',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            backgroundColor: '#fff',
            padding: '0.625rem 1rem 0.625rem 2.5rem',
            fontSize: '0.875rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Predicted to Run Out */}
      <div style={{
        borderRadius: '1rem',
        backgroundColor: '#dbeafe',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <TrendingDown style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>Predicted to Run Out</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {predictedRunOut.map((item) => (
            <div
              key={item.name}
              style={{
                flexShrink: 0,
                borderRadius: '0.75rem',
                backgroundColor: '#fff',
                padding: '0.5rem 0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.125rem' }}>{item.name}</p>
              <p style={{ fontSize: '0.75rem', color: '#3b82f6' }}>{item.predictedDate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory List */}
      <div>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}>All Items</h3>
        {inventoryItems.map((item) => (
          <div
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '0.75rem',
              backgroundColor: '#fff',
              padding: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              marginBottom: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{item.name}</span>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>{item.quantity}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontSize: '0.625rem',
                color: '#666',
                borderRadius: '9999px',
                backgroundColor: '#f3f4f6',
                padding: '0.125rem 0.5rem'
              }}>{item.category}</span>
              <DaysTag days={item.daysRemaining} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}