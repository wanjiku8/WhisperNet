import { useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import axios from 'axios'
import ResponseForm from './ResponseForm'
import HugButton from './HugButton'
import { useAuth } from '../context/AuthContext'

export default function WhisperCard({ whisper, onResponse }) {
  const [showResponses, setShowResponses] = useState(false)
  const [responses, setResponses] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  const { user } = useAuth()

  const fetchResponses = async () => {
    const { data } = await axios.get(`/api/whispers/${whisper.id}/responses`)
    setResponses(data)
  }

  const toggleResponses = () => {
    if (!showResponses) {
      fetchResponses()
    }
    setShowResponses(!showResponses)
  }

  const handleLike = async () => {
    try {
      await axios.post(`/api/whispers/${whisper.id}/react`)
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error reacting:', error)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <div className="font-soft text-gray-700 dark:text-gray-300">
            {whisper.content}
          </div>
          
          {whisper.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {whisper.tags.split(',').map(tag => tag.trim()).filter(tag => tag).map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 text-xs rounded-full bg-whisper-purple bg-opacity-10 text-whisper-purple dark:text-whisper-blue"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <button 
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-500 hover:text-whisper-pink"
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5 text-whisper-pink" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span>{whisper.reactions_count || 0}</span>
            </button>
            
            <button 
              onClick={toggleResponses}
              className="flex items-center space-x-1 text-gray-500 hover:text-whisper-purple"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{whisper.responses_count || 0}</span>
            </button>
            
            <HugButton whisperId={whisper.id} onSuccess={onResponse} />
          </div>
        </div>
      </div>
      
      {showResponses && (
        <div className="mt-4 space-y-4">
          {user && (
            <ResponseForm 
              whisperId={whisper.id} 
              onSuccess={() => {
                fetchResponses()
                onResponse()
              }} 
            />
          )}
          
          <div className="space-y-3">
            {responses.map(response => (
              <div key={response.id} className="pl-4 border-l-2 border-whisper-purple border-opacity-30">
                <div className="text-sm font-soft text-gray-600 dark:text-gray-400">
                  {response.content}
                </div>
                {response.is_hug && (
                  <div className="text-xs mt-1 text-whisper-pink">
                    {response.is_gpt ? 'AI Hug' : 'Human Hug'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}