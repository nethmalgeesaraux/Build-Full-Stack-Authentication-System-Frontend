import React from 'react'

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '2rem', 
      textAlign: 'center', 
      marginTop: '4rem',
      borderTop: '1px solid #ddd'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.95rem' }}>
          © 2026 Our Product. All rights reserved.
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <a href="#privacy" style={{ color: '#007bff', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</a>
          <a href="#terms" style={{ color: '#007bff', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</a>
          <a href="#contact" style={{ color: '#007bff', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Us</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer