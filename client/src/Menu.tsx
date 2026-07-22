import React from 'react';

interface MenuProps {
  onPlay: () => void;
  graphicsQuality: 'low' | 'medium' | 'high';
  setGraphicsQuality: (quality: 'low' | 'medium' | 'high') => void;
}

export default function Menu({ onPlay, graphicsQuality, setGraphicsQuality }: MenuProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e2937 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f1f5f9',
      zIndex: 1000,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ 
          fontSize: '4.5rem', 
          margin: 0, 
          background: 'linear-gradient(90deg, #e0e7ff, #f1f5f9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          COD MOBILE
        </h1>
        <p style={{ fontSize: '1.3rem', marginTop: '10px', opacity: 0.7 }}>
          Browser Edition
        </p>
      </div>

      {/* Play Button */}
      <button 
        onClick={onPlay}
        style={{
          padding: '18px 80px',
          fontSize: '1.5rem',
          fontWeight: 600,
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          marginBottom: '50px',
          boxShadow: '0 10px 15px -3px rgb(239 68 68 / 0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        PLAY
      </button>

      {/* Graphics Settings */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '30px 50px',
        borderRadius: '16px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        textAlign: 'center',
        backdropFilter: 'blur(12px)'
      }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Graphics Quality</h3>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {(['low', 'medium', 'high'] as const).map((quality) => (
            <button
              key={quality}
              onClick={() => setGraphicsQuality(quality)}
              style={{
                padding: '12px 28px',
                fontSize: '1rem',
                background: graphicsQuality === quality ? '#22c55e' : '#334155',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {quality}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}