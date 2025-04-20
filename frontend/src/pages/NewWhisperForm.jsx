import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const whisperSchema = Yup.object().shape({
  content: Yup.string().required('Content is required'),
  tags: Yup.string(),
})

export default function NewWhisperForm({ onSuccess }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-poetic mb-4 text-whisper-purple dark:text-whisper-pink">
        Share a Whisper
      </h2>
      <Formik
        initialValues={{ content: '', tags: '', is_anonymous: true }}
        validationSchema={whisperSchema}
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
          <Form className="space-y-4">
            <div>
              <Field
                as="textarea"
                name="content"
                placeholder="What's on your heart?"
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 min-h-[100px]"
              />
              <ErrorMessage name="content" component="div" className="text-red-500 text-sm" />
            </div>
            
            <div>
              <Field
                type="text"
                name="tags"
                placeholder="Tags (comma separated, e.g. relationships, family)"
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
            
            <div className="flex items-center">
              <Field
                type="checkbox"
                name="is_anonymous"
                id="is_anonymous"
                className="mr-2"
              />
              <label htmlFor="is_anonymous" className="text-sm font-soft">
                Post anonymously
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-whisper-purple text-white py-2 px-4 rounded hover:bg-opacity-90 transition font-soft"
            >
              {isSubmitting ? 'Posting...' : 'Share Whisper'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}