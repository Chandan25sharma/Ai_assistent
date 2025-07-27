'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Brain, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          description: 'There is a problem with the server configuration. Please contact support.',
          suggestion: 'This might be a temporary issue. Please try again later.'
        }
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          description: 'You do not have permission to sign in.',
          suggestion: 'Please contact an administrator if you believe this is an error.'
        }
      case 'Verification':
        return {
          title: 'Verification Failed',
          description: 'The verification token has expired or has already been used.',
          suggestion: 'Please try signing in again.'
        }
      case 'Default':
        return {
          title: 'Authentication Error',
          description: 'An error occurred during the authentication process.',
          suggestion: 'Please try signing in again.'
        }
      case 'Callback':
        return {
          title: 'OAuth Callback Error',
          description: 'There was a problem connecting to the authentication provider.',
          suggestion: 'This might be due to network issues. Please try again.'
        }
      case 'OAuthSignin':
        return {
          title: 'OAuth Sign-in Error',
          description: 'Error occurred during OAuth sign-in process.',
          suggestion: 'Please try signing in with a different provider or email.'
        }
      case 'OAuthCallback':
        return {
          title: 'OAuth Callback Error',
          description: 'Error in OAuth callback process.',
          suggestion: 'Please try signing in again.'
        }
      case 'OAuthCreateAccount':
        return {
          title: 'Account Creation Error',
          description: 'Could not create your account with OAuth provider.',
          suggestion: 'Please try signing in with email or a different provider.'
        }
      case 'EmailCreateAccount':
        return {
          title: 'Email Account Error',
          description: 'Could not create account with email.',
          suggestion: 'Please check your email and try again.'
        }
      case 'CredentialsSignin':
        return {
          title: 'Invalid Credentials',
          description: 'The email or password you entered is incorrect.',
          suggestion: 'Please check your credentials and try again.'
        }
      default:
        return {
          title: 'Authentication Error',
          description: 'An unexpected error occurred during authentication.',
          suggestion: 'Please try again or contact support if the problem persists.'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Authentication Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            We encountered a problem signing you in
          </p>
        </div>

        {/* Error Details */}
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-center text-red-600 dark:text-red-400">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-center">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    What happened?
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {errorInfo.suggestion}
                  </p>
                  {error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-mono">
                      Error code: {error}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                asChild
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Link href="/auth/signin">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/">
                  <Brain className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Help */}
            <div className="text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Still having trouble?{' '}
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Contact support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
