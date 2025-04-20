import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

const validationSchema = Yup.object().shape({
  content: Yup.string().required('Response cannot be empty'),
})

export default function ResponseForm({ whisperId, onSuccess }) {
  return (
    <Formik
      initialValues={{ content: '', is_anonymous: true }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await axios.post(`/api/whispers/${whisperId}/responses`, values)
          resetForm()
          onSuccess()
        } catch (error) {
          console.error('Error creating response:', error)
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mb-4">
          <div className="flex gap-2">
            <Field
              as="textarea"
              name="content"
              placeholder="Write a kind response..."
              className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 min-h-[60px]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-whisper-blue text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
          <ErrorMessage name="content" component="div" className="text-red-500 text-sm" />
          
          <div className="mt-2 flex items-center">
            <Field
              type="checkbox"
              name="is_anonymous"
              id={`anon-${whisperId}`}
              className="mr-2"
            />
            <label htmlFor={`anon-${whisperId}`} className="text-sm">
              Respond anonymously
            </label>
          </div>
        </Form>
      )}
    </Formik>
  )
}