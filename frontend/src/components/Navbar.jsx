import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <nav className="bg-white dark:bg-whisper-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-poetic text-whisper-purple dark:text-whisper-pink">
                WhisperNet
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-1 rounded-full">
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-300" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-600" />
              )}
            </button>
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-soft">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-soft text-whisper-pink"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-soft">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-soft text-whisper-purple dark:text-whisper-blue"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}