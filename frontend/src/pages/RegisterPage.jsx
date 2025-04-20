import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const registerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
})

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-poetic text-center mb-8 text-whisper-purple dark:text-whisper-pink">
        Join the Garden
      </h1>
      <Formik
        initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={registerSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await register(values)
            navigate('/')
          } catch (error) {
            setErrors({ general: error.response?.data?.error || 'Registration failed' })
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form className="space-y-6">
            {errors.general && (
              <div className="text-red-500 text-sm">{errors.general}</div>
            )}
            
            <div>
              <label htmlFor="username" className="block font-soft mb-1">
                Username
              </label>
              <Field
                type="text"
                name="username"
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
            </div>
            
            <div>
              <label htmlFor="email" className="block font-soft mb-1">
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            
            <div>
              <label htmlFor="password" className="block font-soft mb-1">
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block font-soft mb-1">
                Confirm Password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-whisper-purple text-white py-2 rounded hover:bg-opacity-90 transition font-soft"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}