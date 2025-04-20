import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import WhisperCard from '../components/WhisperCard'

export default function WhisperPage() {
  const { id } = useParams()
  const [whisper, setWhisper] = useState(null)

  useEffect(() => {
    const fetchWhisper = async () => {
      try {
        const { data } = await axios.get(`/api/whispers/${id}`)
        setWhisper(data)
      } catch (error) {
        console.error('Error fetching whisper:', error)
      }
    }
    fetchWhisper()
  }, [id])

  if (!whisper) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto py-8">
      <WhisperCard whisper={whisper} showResponsesInitially={true} />
    </div>
  )
}