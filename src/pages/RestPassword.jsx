import React, { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo_home from '../assets/Logo_home.png'
import { useAppContext } from '../Context/useAppContext'
import './RestPassword.css'

const RestPassword = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { sendResetOtp, resetPassword, loading } = useAppContext()
  const [activeAction, setActiveAction] = useState('')

  const initialValues = useMemo(() => {
    const query = new URLSearchParams(search)
    return {
      email: query.get('email') || '',
      otp: query.get('otp') || '',
    }
  }, [search])

  const [formData, setFormData] = useState({
    email: initialValues.email,
    otp: initialValues.otp,
    password: '',
    confirmPassword: '',
  })
  const [otpSent, setOtpSent] = useState(Boolean(initialValues.otp))

  const handleInputChange = (event) => {
    const { id, value } = event.target

    setFormData((prev) => {
      const updatedValues = {
        ...prev,
        [id]: value,
      }

      if (id === 'email') {
        updatedValues.otp = ''
      }

      return updatedValues
    })

    if (id === 'email') {
      setOtpSent(false)
    }
  }

  const handleSendOtp = async () => {
    const email = formData.email.trim()
    if (!email) {
      return
    }

    setActiveAction('otp')
    let result
    try {
      result = await sendResetOtp(email)
    } finally {
      setActiveAction('')
    }

    if (result?.success) {
      setOtpSent(true)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const password = formData.password.trim()
    const confirmPassword = formData.confirmPassword.trim()

    if (password.length < 6) {
      return
    }

    if (password !== confirmPassword) {
      return
    }

    setActiveAction('reset')
    let result
    try {
      result = await resetPassword({
        email: formData.email,
        otp: formData.otp,
        password,
        confirmPassword,
      })
    } finally {
      setActiveAction('')
    }

    if (result?.success) {
      navigate('/login')
    }
  }

  const passwordsMatch = formData.password && formData.confirmPassword
    ? formData.password === formData.confirmPassword
    : true

  const canSubmit = Boolean(
    formData.email.trim() &&
    formData.otp.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.password.length >= 6 &&
    passwordsMatch
  )
  const isSendingOtp = loading && activeAction === 'otp'
  const isUpdatingPassword = loading && activeAction === 'reset'

  return (
    <div className="reset-page">
      <Link to="/" className="reset-brand">
        <img src={Logo_home} alt="Authify logo" />
        <span>Authify</span>
      </Link>

      <div className="reset-shell">
        <section className="reset-intro">
          <h1>Set a New Password</h1>
          <p>
            Keep your account secure by creating a strong password you have not used before.
          </p>
          <div className="reset-pill">
            <i className="bi bi-key-fill"></i>
            Password reset is protected by one-time OTP verification
          </div>
        </section>

        <section className="reset-card">
          <h2>Reset Password</h2>
          <p className="reset-subtitle">Request OTP and then create your new password</p>

          <form className="reset-form" onSubmit={handleSubmit}>
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your account email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <button
              type="button"
              className="reset-otp-btn"
              onClick={handleSendOtp}
              disabled={loading || !formData.email.trim()}
            >
              {isSendingOtp ? 'Sending OTP...' : otpSent ? 'Resend OTP' : 'Send OTP'}
            </button>

            {otpSent && (
              <p className="reset-hint">
                OTP sent successfully. Check your inbox and enter the code below.
              </p>
            )}

            <label htmlFor="otp" className="form-label">OTP Code</label>
            <input
              type="text"
              id="otp"
              className="form-control"
              placeholder="Enter the OTP"
              value={formData.otp}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
            />

            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-control ${!passwordsMatch ? 'is-invalid' : ''}`}
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              minLength={6}
            />

            {!passwordsMatch && (
              <p className="reset-error">Password confirmation does not match.</p>
            )}

            <button type="submit" className="reset-btn" disabled={loading || !canSubmit}>
              {isUpdatingPassword ? 'Please wait...' : 'Update Password'}
              {!isUpdatingPassword && <i className="bi bi-arrow-right ms-2"></i>}
            </button>

            <p className="reset-login-link">
              Remember your password? <Link to="/login">Back to Login</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default RestPassword
