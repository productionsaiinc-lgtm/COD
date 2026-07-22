import React from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onMainMenu: () => void;
}

export default function PauseMenu({ onResume, onMainMenu }: PauseMenuProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      color: '#f1f5f9',
      backdropFilter: 'blur(8px)'
    }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '50px' }}>PAUSED</h2>

      <button 
        onClick={onResume}
        style={{
          padding: '16px 70px',
          fontSize: '1.3rem',
          background: '#22c55e',
          color: 'black',
          fontWeight: 600,
          border: 'none',
          borderRadius: '10px',
          marginBottom: '18px',
          cursor: 'pointer'
        }}
      >
        Resume
      </button>

      <button 
        onClick={onMainMenu}
        style={{
          padding: '16px 70px',
          fontSize: '1.3rem',
          background: '#475569',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        Main Menu
      </button>
    </div>
  );
}