'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Brain, 
  MessageCircle, 
  Code, 
  Globe, 
  Mic, 
  Search,
  Zap,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { apiService } from '@/lib/api'

interface SystemStatus {
  status: string
  ollama_status: any
  internet_status: boolean
  authenticated: boolean
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const status = await apiService.getStatus()
        setSystemStatus(status)
      } catch (error) {
        console.error('Failed to fetch system status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSystemStatus()
  }, [])

  const features = [
    {
      title: 'Chat Assistant',
      description: 'Advanced AI conversation with memory',
      icon: MessageCircle,
      href: '/chat',
      color: 'bg-blue-500'
    },
    {
      title: 'Code Generator',
      description: 'Generate and explain code in multiple languages',
      icon: Code,
      href: '/code',
      color: 'bg-green-500'
    },
    {
      title: 'Translation',
      description: 'Translate text between multiple languages',
      icon: Globe,
      href: '/translate',
      color: 'bg-purple-500'
    },
    {
      title: 'Voice Processing',
      description: 'Text-to-speech and speech-to-text',
      icon: Mic,
      href: '/voice',
      color: 'bg-orange-500'
    },
    {
      title: 'Web Search',
      description: 'Search the web with AI assistance',
      icon: Search,
      href: '/search',
      color: 'bg-pink-500'
    },
    {
      title: 'Memory Management',
      description: 'Manage AI memory and knowledge base',
      icon: Brain,
      href: '/memory',
      color: 'bg-indigo-500'
    }
  ]

  const stats = [
    {
      title: 'Total Conversations',
      value: '1,234',
      change: '+12%',
      icon: MessageCircle
    },
    {
      title: 'Code Generated',
      value: '456',
      change: '+8%',
      icon: Code
    },
    {
      title: 'Translations',
      value: '789',
      change: '+15%',
      icon: Globe
    },
    {
      title: 'Voice Processes',
      value: '321',
      change: '+5%',
      icon: Mic
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name || 'User'}! 👋
          </h1>
          <p className="text-blue-100 text-lg mb-6">
            Your AI assistant is ready to help you with coding, translations, web search, and more.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/chat'}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '/code'}
            >
              <Code className="w-5 h-5 mr-2" />
              Generate Code
            </Button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${systemStatus?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="font-medium">Backend Service</p>
                  <p className="text-sm text-gray-500">
                    {systemStatus?.status === 'active' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${systemStatus?.ollama_status?.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div>
                  <p className="font-medium">Ollama AI</p>
                  <p className="text-sm text-gray-500">
                    {systemStatus?.ollama_status?.status === 'available' ? 'Available' : 'Limited'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${systemStatus?.internet_status ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="font-medium">Internet</p>
                  <p className="text-sm text-gray-500">
                    {systemStatus?.internet_status ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Available Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-gray-50 dark:group-hover:bg-gray-800"
                    onClick={() => window.location.href = feature.href}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Code generation completed</p>
                <p className="text-sm text-gray-500">Generated Python script for data analysis</p>
              </div>
              <Badge variant="secondary">2 min ago</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Translation completed</p>
                <p className="text-sm text-gray-500">English to Spanish translation</p>
              </div>
              <Badge variant="secondary">5 min ago</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Chat session started</p>
                <p className="text-sm text-gray-500">New conversation with AI assistant</p>
              </div>
              <Badge variant="secondary">10 min ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
