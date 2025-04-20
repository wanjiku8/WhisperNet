import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function HugButton({ whisperId, onSuccess }) {
  const [isSending, setIsSending] = useState(false)

  const sendHug = async () => {
    setIsSending(true)
    try {
      await axios.post(`/api/whispers/${whisperId}/hug`)
      onSuccess()
    } catch (error) {
      console.error('Error sending hug:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={sendHug}
      disabled={isSending}
      className="px-3 py-1 text-sm rounded-full bg-whisper-pink bg-opacity-10 text-whisper-pink hover:bg-opacity-20 transition"
    >
      {isSending ? 'Sending...' : 'Send Hug'}
    </motion.button>
  )
}