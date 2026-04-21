import React, { createContext, useMemo, useState ,useCallback} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppConstants } from '../util/Constants'

const defaultContextValue = {
  apiBaseUrl: '',
  token: '',
  user: null,
  userEmail: '',
  loading: false,
  isAuthenticated: false,
  registerUser: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  loginUser: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  sendOtp: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  verifyOtp: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  sendResetOtp: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  resetPassword: async () => ({ success: false, message: 'AppContextProvider is missing' }),
  logoutUser: async () => ({ success: false, message: 'AppContextProvider is missing' }),
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
const getEmailFromResponse = (data) =>
  data?.user?.email ||
  data?.data?.user?.email ||
  data?.email ||
  data?.data?.email ||
  ''

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  return localStorage.getItem('token') || ''
}

const getStoredUserEmail = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  return localStorage.getItem('userEmail') || ''
}

const getAuthConfig = (rawToken) => {
  const authToken = rawToken || getStoredToken()
  const baseConfig = { withCredentials: true }

  if (!authToken) {
    return baseConfig
  }

  return {
    ...baseConfig,
    headers: {
      Authorization: `Bearer ${authToken}`,
      token: authToken,
    },
  }
}

export const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [userEmail, setUserEmail] = useState(getStoredUserEmail)

  const persistAuthState = useCallback((data) => {
    const nextToken = getTokenFromResponse(data)
    const nextUser = getUserFromResponse(data)
    const nextEmail = getEmailFromResponse(data)

    if (nextToken) {
      localStorage.setItem('token', nextToken)
      setToken(nextToken)
    }

    if (nextUser) {
      setUser(nextUser)
    }

    if (nextEmail) {
      localStorage.setItem('userEmail', nextEmail)
      setUserEmail(nextEmail)
    }
  }, [])

  const registerUser = useCallback(async ({ fullName, email, password }) => {
    setLoading(true)

    try {
      const { data } = await axios.post(
        `${getApiBaseUrl()}/api/profile/register`,
        {
          fullName,
          name: fullName,
          email,
          password,
        },
        { withCredentials: true }
      )

      persistAuthState(data)
      const resolvedEmail = getEmailFromResponse(data) || email?.trim()
      if (resolvedEmail) {
        localStorage.setItem('userEmail', resolvedEmail)
        setUserEmail(resolvedEmail)
      }
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
      const { data } = await axios.post(
        `${getApiBaseUrl()}/api/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )

      persistAuthState(data)
      const resolvedEmail = getEmailFromResponse(data) || email?.trim()
      if (resolvedEmail) {
        localStorage.setItem('userEmail', resolvedEmail)
        setUserEmail(resolvedEmail)
      }
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

  const sendOtp = useCallback(async (email) => {
    setLoading(true)
    const trimmedEmail = email?.trim()

    try {
      if (!trimmedEmail) {
        toast.error('Email is required')
        return { success: false, message: 'Email is required' }
      }

      const endpoint = `${getApiBaseUrl()}/api/sendOtp`
      const authConfig = getAuthConfig(token)
      const requests = [
        () => axios.post(endpoint, { email: trimmedEmail }, authConfig),
        () => axios.post(endpoint, null, { ...authConfig, params: { email: trimmedEmail } }),
        () => axios.post(endpoint, { email: trimmedEmail }, { withCredentials: true }),
        () => axios.post(endpoint, null, { withCredentials: true, params: { email: trimmedEmail } }),
      ]

      let data
      let lastError

      for (const request of requests) {
        try {
          const response = await request()
          data = response.data
          break
        } catch (requestError) {
          lastError = requestError
        }
      }

      if (!data && lastError) {
        throw lastError
      }

      toast.success(data?.message || 'OTP sent to your email')
      return { success: true, data }
    } catch (error) {
      const message = error?.response?.status === 401
        ? 'Please login first, then try sending OTP again.'
        : getErrorMessage(error, 'Unable to send OTP')
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [token])

  const verifyOtp = useCallback(async ({ email, otp }) => {
    setLoading(true)

    const payload = {
      email: email?.trim(),
      otp: otp?.trim(),
    }

    Object.keys(payload).forEach((key) => {
      if (!payload[key]) {
        delete payload[key]
      }
    })

    try {
      let data
      try {
        const response = await axios.post(
          `${getApiBaseUrl()}/api/verify-otp`,
          payload,
          { withCredentials: true }
        )
        data = response.data
      } catch (primaryError) {
        const hasAuthToken = Boolean(token || getStoredToken())
        if (primaryError?.response?.status === 401 && hasAuthToken) {
          const response = await axios.post(
            `${getApiBaseUrl()}/api/verify-otp`,
            payload,
            getAuthConfig(token)
          )
          data = response.data
        } else {
          throw primaryError
        }
      }

      toast.success(data?.message || 'Email verified successfully')
      return { success: true, data }
    } catch (error) {
      const message = error?.response?.status === 401
        ? 'Please login first, then verify your OTP.'
        : getErrorMessage(error, 'Unable to verify OTP')
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [token])

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

  const clearLocalAuthState = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setToken('')
    setUser(null)
    setUserEmail('')
  }, [])

  const logoutUser = useCallback(async () => {
    setLoading(true)

    try {
      const endpoint = `${getApiBaseUrl()}/api/logout`
      let data

      try {
        const response = await axios.post(endpoint, null, getAuthConfig(token))
        data = response.data
      } catch (primaryError) {
        if (primaryError?.response?.status === 404 || primaryError?.response?.status === 405) {
          const response = await axios.get(endpoint, getAuthConfig(token))
          data = response.data
        } else {
          throw primaryError
        }
      }

      toast.success(data?.message || 'Logout successful')
      return { success: true, data }
    } catch (error) {
      if (error?.response?.status !== 401) {
        toast.info('Logged out locally')
      }
      return { success: error?.response?.status === 401, message: getErrorMessage(error, 'Logged out locally') }
    } finally {
      clearLocalAuthState()
      setLoading(false)
    }
  }, [token, clearLocalAuthState])

  const contextValue = useMemo(
    () => ({
      apiBaseUrl: getApiBaseUrl(),
      token,
      user,
      userEmail,
      loading,
      isAuthenticated: Boolean(token || user?.email || userEmail),
      registerUser,
      loginUser,
      sendOtp,
      verifyOtp,
      sendResetOtp,
      resetPassword,
      logoutUser,
      setUser,
    }),
    [token, user, userEmail, loading, registerUser, loginUser, sendOtp, verifyOtp, sendResetOtp, resetPassword, logoutUser]
  )

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export default AppContext
