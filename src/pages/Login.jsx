import React, { useState } from 'react'
import Logo_home from '../assets/Logo_home.png'
import { Link } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="login-page">
      <Link to="/" className="login-brand">
        <img src={Logo_home} alt="Authify logo" />
        <span>Authify</span>
      </Link>

      <div className="login-shell">
        <section className="login-intro">
          <h1>{isCreateAccount ? 'Create Your Account' : 'Welcome Back'}</h1>
          <p>
            {isCreateAccount
              ? 'Start your secure Authify journey and manage your account with confidence.'
              : 'Securely access your dashboard, manage your account, and continue your workflow in seconds.'}
          </p>
          <div className="intro-pill">
            <i className="bi bi-shield-check"></i>
            Trusted authentication for your team
          </div>
        </section>

        <section className="login-card">
          <h2>{isCreateAccount ? 'Create Account' : 'Login'}</h2>
          <p className="login-subtitle">
            {isCreateAccount ? 'Fill your details to create a new account' : 'Enter your credentials to continue'}
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            {isCreateAccount && (
              <>
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  className="form-control"
                  placeholder="Enter fullname"
                  required
                />
              </>
            )}

            <label htmlFor="email" className="form-label">Email Id</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter email"
              required
            />

            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="************"
              required
            />

            <div className={`login-actions ${isCreateAccount ? 'signup-actions' : ''}`}>
              {!isCreateAccount && (
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
              )}
              <Link to="/reset-password" className="forgot-link">Forgot password?</Link>
            </div>

            <button type="submit" className="login-btn">
              {isCreateAccount ? 'Sign Up' : 'Sign In'} <i className="bi bi-arrow-right ms-2"></i>
            </button>

            <p className="mode-switch">
              {isCreateAccount ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className="mode-switch-btn"
                onClick={() => setIsCreateAccount((prev) => !prev)}
              >
                {isCreateAccount ? 'Login' : 'Create Account'}
              </button>
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Login
