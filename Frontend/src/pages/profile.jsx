import {
  User,
  Leaf,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react"

const dietRestrictions = [
  { label: "Gluten Free", active: true },
  { label: "Low Sodium", active: true },
  { label: "Dairy Free", active: false },
  { label: "Nut Allergy", active: false },
  { label: "Vegetarian", active: false },
  { label: "Keto", active: true },
]

const savingsStats = [
  { label: "This Week", amount: "$14.20", icon: <DollarSign className="h-4 w-4" /> },
  { label: "This Month", amount: "$62.50", icon: <TrendingUp className="h-4 w-4" /> },
  { label: "All Time", amount: "$412.80", icon: <ShieldCheck className="h-4 w-4" /> },
]

const menuItems = [
  { label: "Notifications", icon: <Bell className="h-5 w-5" /> },
  { label: "App Settings", icon: <Settings className="h-5 w-5" /> },
  { label: "Help & Support", icon: <HelpCircle className="h-5 w-5" /> },
]

export default function Profile() {
  return (
    <div style={{ padding: '1.5rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          backgroundColor: '#f0f4f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <User style={{ width: '2rem', height: '2rem', color: '#8B7355' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.125rem' }}>Alex Johnson</h1>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>Member since Jan 2025</p>
        </div>
      </div>

      {/* Savings Stats */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}>Savings Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {savingsStats.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                borderRadius: '1rem',
                backgroundColor: '#fff',
                padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                backgroundColor: '#f0f4f0',
                color: '#8B7355',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{stat.amount}</span>
              <span style={{ fontSize: '0.625rem', color: '#666' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diet Restrictions */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Leaf style={{ width: '1rem', height: '1rem', color: '#8B7355' }} />
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Diet Preferences</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {dietRestrictions.map((diet) => (
            <span
              key={diet.label}
              style={{
                borderRadius: '9999px',
                padding: '0.375rem 0.875rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: diet.active ? '#8B7355' : '#f3f4f6',
                color: diet.active ? '#fff' : '#666',
                border: diet.active ? 'none' : '1px solid #e5e7eb'
              }}
            >
              {diet.label}
            </span>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div style={{
        borderRadius: '1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.1)',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <AlertCircle style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ef4444' }}>Allergies</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{
            borderRadius: '9999px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            padding: '0.25rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            color: '#ef4444'
          }}>
            Shellfish
          </span>
          <span style={{
            borderRadius: '9999px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            padding: '0.25rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            color: '#ef4444'
          }}>
            Peanuts
          </span>
        </div>
      </div>

      {/* Weekly Summary Card */}
      <div style={{
        borderRadius: '1rem',
        backgroundColor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        padding: '1rem',
        border: '1px solid rgba(255,255,255,0.5)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>Weekly Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B7355' }}>12</span>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Meals Planned</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>3</span>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Items Saved from Waste</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>28</span>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Items Tracked</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B7355' }}>92%</span>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>Freshness Score</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '1rem',
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {menuItems.map((item, idx) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              borderBottom: idx !== menuItems.length - 1 ? '1px solid #e5e7eb' : 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {item.icon}
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.label}</span>
            </div>
            <ChevronRight style={{ width: '1rem', height: '1rem', color: '#666' }} />
          </div>
        ))}
      </div>
    </div>
  )
}