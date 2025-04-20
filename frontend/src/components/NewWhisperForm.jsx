import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

const validationSchema = Yup.object().shape({
  content: Yup.string().required('Whisper content is required'),
  tags: Yup.string(),
})

export default function NewWhisperForm({ onSuccess }) {
  return (
    <Formik
      initialValues={{ content: '', tags: '', is_anonymous: true }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await axios.post('/api/whispers', values)
          resetForm()
          onSuccess()
        } catch (error) {
          console.error('Error creating whisper:', error)
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="space-y-4">
            <Field
              as="textarea"
              name="content"
              placeholder="Write your anonymous whisper..."
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 min-h-[120px]"
            />
            <ErrorMessage name="content" component="div" className="text-red-500 text-sm" />
            
            <Field
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
            />
            
            <div className="flex items-center">
              <Field
                type="checkbox"
                name="is_anonymous"
                id="is_anonymous"
                className="mr-2"
              />
              <label htmlFor="is_anonymous" className="text-sm">
                Post anonymously
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-whisper-purple text-white px-6 py-2 rounded hover:bg-opacity-90 transition"
            >
              {isSubmitting ? 'Posting...' : 'Share Whisper'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}