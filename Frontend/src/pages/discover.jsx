import { useState } from "react"
import { Camera, Clock, Flame, DollarSign, Dumbbell, Sparkles, X, ShoppingBag } from "lucide-react"

const vibes = [
  { id: "quick", label: "Quick & Easy", icon: <Clock className="h-3.5 w-3.5" /> },
  { id: "budget", label: "Budget Friendly", icon: <DollarSign className="h-3.5 w-3.5" /> },
  { id: "protein", label: "High Protein", icon: <Dumbbell className="h-3.5 w-3.5" /> },
  { id: "trending", label: "Trending", icon: <Flame className="h-3.5 w-3.5" /> },
]

const recipes = [
  {
    name: "Mediterranean Bowl",
    time: "25 min",
    calories: "450 cal",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    canMakeNow: true,
    missingItems: [],
  },
  {
    name: "Chicken Stir Fry",
    time: "20 min",
    calories: "380 cal",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    canMakeNow: true,
    missingItems: [],
  },
  {
    name: "Avocado Toast Deluxe",
    time: "10 min",
    calories: "290 cal",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
    canMakeNow: true,
    missingItems: [],
  },
  {
    name: "Thai Green Curry",
    time: "35 min",
    calories: "520 cal",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    canMakeNow: false,
    missingItems: ["Coconut Milk", "Thai Basil"],
  },
  {
    name: "Salmon Teriyaki",
    time: "30 min",
    calories: "410 cal",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    canMakeNow: false,
    missingItems: ["Salmon Fillet", "SesSeeds"],
  },
  {
    name: "Caprese Salad",
    time: "10 min",
    calories: "250 cal",
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=300&fit=crop",
    canMakeNow: false,
    missingItems: ["Fresh Mozzarella"],
  },
]

export default function Discover() {
  const [activeVibe, setActiveVibe] = useState("quick")
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const fridgeRecipes = recipes.filter((r) => r.canMakeNow)
  const otherRecipes = recipes.filter((r) => !r.canMakeNow)
  const selected = recipes.find((r) => r.name === selectedRecipe)

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Magic Chef</h1>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>AI-powered recipe discovery</p>
      </div>

      {/* Vibe Toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {vibes.map((vibe) => (
          <button
            key={vibe.id}
            onClick={() => setActiveVibe(vibe.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              border: activeVibe === vibe.id ? 'none' : '1px solid #ddd',
              backgroundColor: activeVibe === vibe.id ? '#8B7355' : '#fff',
              color: activeVibe === vibe.id ? '#fff' : '#666',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {vibe.icon}
            {vibe.label}
          </button>
        ))}
      </div>

      {/* Context Card */}
      <div style={{ 
        borderRadius: '1rem', 
        backgroundColor: '#f0f4f0', 
        padding: '1rem',
        border: '1px solid rgba(139, 115, 85, 0.2)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            backgroundColor: '#8B7355',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.125rem' }}>Based on your Fridge</h3>
            <p style={{ fontSize: '0.75rem', color: '#666' }}>
              You can make these {fridgeRecipes.length} meals right now without buying anything.
            </p>
          </div>
        </div>
      </div>

      {/* Fridge Recipes */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: '#666', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          marginBottom: '0.75rem'
        }}>Ready Now</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {fridgeRecipes.map((recipe) => (
            <button
              key={recipe.name}
              onClick={() => setSelectedRecipe(recipe.name)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '1rem',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                textAlign: 'left',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '0.75rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>{recipe.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.625rem', color: '#666' }}>{recipe.time}</span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#666' }} />
                  <span style={{ fontSize: '0.625rem', color: '#666' }}>{recipe.calories}</span>
                </div>
              </div>
              <span style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                borderRadius: '9999px',
                backgroundColor: '#4ade80',
                padding: '0.125rem 0.5rem',
                fontSize: '0.625rem',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                Ready
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Other Recipes */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: '#666', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          marginBottom: '0.75rem'
        }}>Discover More</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {otherRecipes.map((recipe) => (
            <button
              key={recipe.name}
              onClick={() => setSelectedRecipe(recipe.name)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '1rem',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                textAlign: 'left',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '0.75rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>{recipe.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.625rem', color: '#666' }}>{recipe.time}</span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#666' }} />
                  <span style={{ fontSize: '0.625rem', color: '#666' }}>{recipe.calories}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Snap-to-Dish Banner */}
      <div style={{
        borderRadius: '1rem',
        backgroundColor: '#dbeafe',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        border: '1px solid rgba(59, 130, 246, 0.2)'
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
          <Camera style={{ width: '1.25rem', height: '1.25rem' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.125rem' }}>Snap-to-Dish</h3>
          <p style={{ fontSize: '0.75rem', color: '#666' }}>Upload a restaurant photo to reverse-engineer the recipe.</p>
        </div>
      </div>

      {/* Missing Items Modal */}
      {selected && !selected.canMakeNow && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '32rem',
            borderRadius: '1.5rem 1.5rem 0 0',
            backgroundColor: '#fff',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{selected.name}</h3>
              <button onClick={() => setSelectedRecipe(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.75rem' }}>Missing ingredients:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selected.missingItems.map((item) => (
                <div key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  padding: '0.75rem',
                  border: '1px solid rgba(239, 68, 68, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShoppingBag style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '500' }}>Add to cart</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedRecipe(null)}
              style={{
                marginTop: '1rem',
                width: '100%',
                borderRadius: '0.75rem',
                backgroundColor: '#3b82f6',
                padding: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Add All to Smart Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}