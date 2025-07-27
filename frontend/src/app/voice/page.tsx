'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Mic, MicOff, Volume2, Download, Play, Square } from 'lucide-react'
import { apiService } from '@/lib/api'

export default function VoicePage() {
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcribedText, setTranscribedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTextToSpeech = async () => {
    if (!text.trim()) return

    setIsLoading(true)
    try {
      const response = await apiService.textToSpeech(text)
      if (response.audio_url) {
        setAudioUrl(response.audio_url)
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpeechToText = async () => {
    // This would typically involve recording audio from the microphone
    // For now, we'll simulate with a placeholder
    setIsRecording(!isRecording)
    
    if (isRecording) {
      // Stop recording and process
      try {
        // Placeholder - in real implementation, you'd pass actual audio data
        const response = await apiService.speechToText('audio_data_placeholder')
        setTranscribedText(response.text || '')
      } catch (error) {
        console.error('Error with speech-to-text:', error)
      }
    }
  }

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      setIsPlaying(true)
      audio.play()
      audio.onended = () => setIsPlaying(false)
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Voice Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Convert text to speech and speech to text
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text to Speech */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5" />
                <span>Text to Speech</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text to convert to speech..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
              />
              
              <Button 
                onClick={handleTextToSpeech} 
                disabled={isLoading || !text.trim()}
                className="w-full"
              >
                {isLoading ? 'Generating...' : 'Convert to Speech'}
              </Button>

              {audioUrl && (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={playAudio}
                      disabled={isPlaying}
                    >
                      {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Playing...' : 'Play'}
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={audioUrl} download="speech.mp3">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Speech to Text */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mic className="w-5 h-5" />
                <span>Speech to Text</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  onClick={handleSpeechToText}
                  className="rounded-full w-20 h-20"
                >
                  {isRecording ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </Button>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
              </div>

              {transcribedText && (
                <div>
                  <h4 className="font-semibold mb-2">Transcribed Text:</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p>{transcribedText}</p>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 text-center">
                Note: Speech recognition requires microphone permissions and may not work in all browsers.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voice Commands Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Commands Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Available Commands:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• "Generate code for..."</li>
                  <li>• "Translate ... to ..."</li>
                  <li>• "Search for..."</li>
                  <li>• "Remember that..."</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tips:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Speak clearly and slowly</li>
                  <li>• Use a quiet environment</li>
                  <li>• Allow microphone permissions</li>
                  <li>• Use voice commands in chat</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
