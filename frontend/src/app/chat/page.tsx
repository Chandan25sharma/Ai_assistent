'use client'

import ChatInterface from '@/components/ChatInterface'

export default function ChatPage() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chat Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Interact with Sorma AI using natural language
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  )
}
