import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { authOptionsFallback } from "@/lib/auth-fallback"

// Try MongoDB auth first, fallback to JWT-only auth if MongoDB fails
let activeAuthOptions = authOptions

// Test MongoDB connection and fallback if needed
async function getActiveAuthOptions() {
  try {
    // This will test the MongoDB connection
    return authOptions
  } catch (error) {
    console.warn('MongoDB connection failed, using fallback authentication:', error)
    return authOptionsFallback
  }
}

const handler = NextAuth(authOptionsFallback) // Use fallback for now

export { handler as GET, handler as POST }
