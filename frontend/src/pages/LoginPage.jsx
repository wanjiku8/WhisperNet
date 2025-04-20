import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-poetic text-center mb-8 text-whisper-purple dark:text-whisper-pink">
        Welcome Back
      </h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await login(values)
            navigate('/')
          } catch (error) {
            setErrors({ general: 'Invalid credentials' })
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
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
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-whisper-purple text-white py-2 rounded hover:bg-opacity-90 transition font-soft"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}