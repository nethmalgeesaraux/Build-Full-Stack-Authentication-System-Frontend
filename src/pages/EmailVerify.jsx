import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo_home from '../assets/Logo_home.png'
import { useAppContext } from '../Context/useAppContext'
import { toast } from 'react-toastify'
import './EmailVerify.css'

const OTP_LENGTH = 6

const EmailVerify = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { sendOtp, verifyOtp, loading, user, userEmail, isAuthenticated } = useAppContext()
  const [activeAction, setActiveAction] = useState('')
  const inputRefs = useRef([])

  const initialEmail = useMemo(() => {
    const query = new URLSearchParams(search)
    return query.get('email') || user?.email || userEmail || ''
  }, [search, user?.email, userEmail])

  const [email, setEmail] = useState(initialEmail)
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [otpSent, setOtpSent] = useState(false)

  const otpValue = otpDigits.join('')
  const isSendingOtp = loading && activeAction === 'send'
  const isVerifyingOtp = loading && activeAction === 'verify'

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please login first to verify your email.')
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (initialEmail && email !== initialEmail && !otpSent) {
      setEmail(initialEmail)
    }
  }, [initialEmail, email, otpSent])

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    setOtpSent(false)
    setOtpDigits(Array(OTP_LENGTH).fill(''))
  }

  const focusInput = (index) => {
    const field = inputRefs.current[index]
    if (field) {
      field.focus()
      field.select()
    }
  }

  const handleOtpInput = (index, value) => {
    const sanitized = value.replace(/\D/g, '')
    if (!sanitized) {
      setOtpDigits((prev) => {
        const next = [...prev]
        next[index] = ''
        return next
      })
      return
    }

    setOtpDigits((prev) => {
      const next = [...prev]

      for (let i = 0; i < sanitized.length && index + i < OTP_LENGTH; i += 1) {
        next[index + i] = sanitized[i]
      }

      return next
    })

    const nextIndex = Math.min(index + sanitized.length, OTP_LENGTH - 1)
    focusInput(nextIndex)
  }

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      focusInput(index - 1)
    }
  }

  const handleOtpPaste = (event) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) {
      return
    }

    setOtpDigits((prev) => {
      const next = [...prev]
      for (let i = 0; i < OTP_LENGTH; i += 1) {
        next[i] = pasted[i] || ''
      }
      return next
    })

    focusInput(Math.min(pasted.length, OTP_LENGTH) - 1)
  }

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      return
    }

    setActiveAction('send')
    let result
    try {
      result = await sendOtp(trimmedEmail)
    } finally {
      setActiveAction('')
    }

    if (result?.success) {
      setOtpSent(true)
      focusInput(0)
    }
  }

  const handleVerify = async (event) => {
    event.preventDefault()

    if (otpValue.length !== OTP_LENGTH) {
      return
    }

    setActiveAction('verify')
    let result
    try {
      result = await verifyOtp({
        email,
        otp: otpValue,
      })
    } finally {
      setActiveAction('')
    }

    if (result?.success) {
      navigate('/login')
    }
  }

  return (
    <div className="verify-page">
      <Link to="/" className="verify-brand">
        <img src={Logo_home} alt="Authify logo" />
        <span>Authify</span>
      </Link>

      <div className="verify-shell">
        <section className="verify-intro">
          <h1>Verify Your Email</h1>
          <p>
            Enter the OTP sent to your inbox to activate your account and continue securely.
          </p>
          <div className="verify-pill">
            <i className="bi bi-envelope-check-fill"></i>
            Email verification keeps your account protected
          </div>
        </section>

        <section className="verify-card">
          <h2>Email Verification</h2>
          <p className="verify-subtitle">Send OTP, then enter the 6-digit code to verify</p>

          <form className="verify-form" onSubmit={handleVerify}>
            <label htmlFor="verify-email" className="form-label">Email Address</label>
            <input
              id="verify-email"
              type="email"
              className="form-control"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              required
            />

            <button
              type="button"
              className="verify-send-btn"
              onClick={handleSendOtp}
              disabled={loading || !email.trim()}
            >
              {isSendingOtp ? 'Sending OTP...' : otpSent ? 'Resend OTP' : 'Send OTP'}
            </button>

            {otpSent && (
              <p className="verify-hint">
                OTP sent. Please check your email and enter the code below.
              </p>
            )}

            <label className="form-label">Enter OTP</label>
            <div className="otp-grid" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="otp-cell"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleOtpInput(index, event.target.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  aria-label={`OTP digit ${index + 1}`}
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              className="verify-btn"
              disabled={loading || !email.trim() || otpValue.length !== OTP_LENGTH}
            >
              {isVerifyingOtp ? 'Verifying...' : 'Verify Email'}
              {!isVerifyingOtp && <i className="bi bi-check2-circle ms-2"></i>}
            </button>

            <p className="verify-login-link">
              Already verified? <Link to="/login">Back to Login</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default EmailVerify
