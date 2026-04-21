import React, { createContext, useMemo, useState ,useCallback} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppConstants } from '../util/Constants'

const defaultContextValue = {
  apiBaseUrl: '',
  token: '',
  user: null,
  loading: false,
  isAuthenticated: false,
  registerUser: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  loginUser: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  sendResetOtp: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  resetPassword: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  logoutUser: () => {},
  setUser: () => {},
}

const AppContext = createContext(defaultContextValue)

const getApiBaseUrl = () => AppConstants.BACKEND_URL || ''

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback

const getTokenFromResponse = (data) =>
  data?.token ||
  data?.accessToken ||
  data?.data?.token ||
  data?.data?.accessToken ||
  ''

const getUserFromResponse = (data) => data?.user || data?.data?.user || null

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  return localStorage.getItem('token') || ''
}

export const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)

  const persistAuthState = useCallback((data) => {
    const nextToken = getTokenFromResponse(data)
    const nextUser = getUserFromResponse(data)

    if (nextToken) {
      localStorage.setItem('token', nextToken)
      setToken(nextToken)
    }

    if (nextUser) {
      setUser(nextUser)
    }
  }, [])

  const registerUser = useCallback(async ({ fullName, email, password }) => {
    setLoading(true)

    try {
      const { data } = await axios.post(`${getApiBaseUrl()}/api/profile/register`, {
        fullName,
        name: fullName,
        email,
        password,
      })

      persistAuthState(data)
      toast.success(data?.message || 'Account created successfully')
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to create account')
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [persistAuthState])

  const loginUser = useCallback(async ({ email, password }) => {
    setLoading(true)

    try {
      const { data } = await axios.post(`${getApiBaseUrl()}/api/login`, {
        email,
        password,
      })

      persistAuthState(data)
      toast.success(data?.message || 'Login successful')
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to login')
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [persistAuthState])

  const sendResetOtp = useCallback(async (email) => {
    setLoading(true)
    const trimmedEmail = email?.trim()

    try {
      if (!trimmedEmail) {
        toast.error('Email is required')
        return { success: false, message: 'Email is required' }
      }

      const { data } = await axios.post(
        `${getApiBaseUrl()}/api/send-reset-otp`,
        null,
        {
          params: { email: trimmedEmail },
        }
      )

      toast.success(data?.message || 'Reset OTP sent to your email')
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to send reset OTP')
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async ({ email, otp, password, confirmPassword }) => {
    setLoading(true)

    const payload = {
      email: email?.trim(),
      otp: otp?.trim(),
      newPassword: password,
      confirmPassword,
    }

    Object.keys(payload).forEach((key) => {
      if (!payload[key]) {
        delete payload[key]
      }
    })

    try {
      const { data } = await axios.post(`${getApiBaseUrl()}/api/reset-password`, payload)
      toast.success(data?.message || 'Password reset successful')
      return { success: true, data }
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to reset password')
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logoutUser = useCallback(() => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }, [])

  const contextValue = useMemo(
    () => ({
      apiBaseUrl: getApiBaseUrl(),
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      registerUser,
      loginUser,
      sendResetOtp,
      resetPassword,
      logoutUser,
      setUser,
    }),
    [token, user, loading, registerUser, loginUser, sendResetOtp, resetPassword, logoutUser]
  )

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export default AppContext
