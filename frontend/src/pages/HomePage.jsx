import { useEffect, useState } from 'react'
import axios from 'axios'
import WhisperCard from '../components/WhisperCard'
import NewWhisperForm from '../components/NewWhisperForm'

export default function HomePage() {
  const [whispers, setWhispers] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    fetchWhispers()
  }, [selectedTag])

  const fetchWhispers = async () => {
    const url = selectedTag ? `/api/whispers?tag=${selectedTag}` : '/api/whispers'
    const { data } = await axios.get(url)
    setWhispers(data)
    
    // Extract unique tags
    const allTags = data.flatMap(w => w.tags.split(',').map(t => t.trim()).filter(t => t))
    setTags([...new Set(allTags)])
  }

  return (
    <div className="space-y-8">
      <NewWhisperForm onSuccess={fetchWhispers} />
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag('')}
          className={`px-3 py-1 rounded-full text-xs font-soft ${!selectedTag ? 'bg-whisper-purple text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-soft ${selectedTag === tag ? 'bg-whisper-purple text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className="grid gap-6">
        {whispers.map(whisper => (
          <WhisperCard 
            key={whisper.id} 
            whisper={whisper} 
            onResponse={() => fetchWhispers()}
          />
        ))}
      </div>
    </div>
  )
}