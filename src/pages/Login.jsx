import React from 'react'
import Logo_home from '../assets/Logo_home.png'
import { Link } from 'react-router-dom'
import './Login.css'

const Login = () => {
  return (
    <div className="login-page">
      <Link to="/" className="login-brand">
        <img src={Logo_home} alt="Authify logo" />
        <span>Authify</span>
      </Link>

      <div className="login-shell">
        <section className="login-intro">
          <h1>Welcome Back</h1>
          <p>Securely access your dashboard, manage your account, and continue your workflow in seconds.</p>
          <div className="intro-pill">
            <i className="bi bi-shield-check"></i>
            Trusted authentication for your team
          </div>
        </section>

        <section className="login-card">
          <h2>Login</h2>
          <p className="login-subtitle">Enter your credentials to continue</p>

          <form className="login-form">
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

            <div className="login-actions">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/reset-password" className="forgot-link">Forgot password?</Link>
            </div>

            <button type="submit" className="login-btn">
              Sign In <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Login
