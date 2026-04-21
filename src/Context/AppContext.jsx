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
      logoutUser,
      setUser,
    }),
    [token, user, loading, registerUser, loginUser, logoutUser]
  )

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export default AppContext
