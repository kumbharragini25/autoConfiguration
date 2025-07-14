import React from 'react';

export default function AppFooter() {
  return (
    <footer
      className="fixed-bottom py-3"
      style={{
        backgroundColor: '#f8f9fa',
        color: '#555',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}
    >
      <div>&copy; 2025 Prescient Technologies Pvt Ltd. All rights reserved.</div>
      <div style={{ fontSize: '13px', color: '#888' }}>v1.0.0</div>
    </footer>
  );
}
