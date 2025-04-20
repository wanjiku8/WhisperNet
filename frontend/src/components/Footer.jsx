export default function Footer() {
    return (
      <footer className="bg-white dark:bg-whisper-dark border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-soft text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} WhisperNet. All whispers cherished.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-whisper-purple dark:hover:text-whisper-pink text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-whisper-purple dark:hover:text-whisper-pink text-sm">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }