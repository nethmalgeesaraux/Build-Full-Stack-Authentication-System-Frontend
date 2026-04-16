import React from 'react'
import header from '../assets/header.png'

const Header = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', gap: '1rem', padding: '2rem' }}>
      <img src={header} alt="Logo Home" style={{ width: '220px', height: '220px', borderRadius: '50%', objectFit: 'cover', maxWidth: '100%' }} />
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>Welcome to our product</h1>
      <p style={{ maxWidth: '560px', color: '#444', lineHeight: 1.6, margin: 0 }}>
        Let's start with a quick product tour and you can setup the authentication in no time!
      </p>
      <button style={{ padding: '0.9rem 2rem', border: '1px solid #333', borderRadius: '999px', background: '#fff', cursor: 'pointer', marginTop: '1rem' }}>
        Get Started
      </button>
    </div>
  )
}

export default Header