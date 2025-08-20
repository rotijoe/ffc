import { jest } from '@jest/globals'

// Mock the createClient function from @supabase/supabase-js
export const createClient = jest.fn().mockImplementation(() => ({
  rpc: jest.fn(),
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  single: jest.fn(),
  auth: {
    getUser: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  storage: {
    from: jest.fn().mockReturnThis(),
    upload: jest.fn(),
    download: jest.fn(),
  },
}))

// Mock other exports as needed
export const SupabaseClient = jest.fn()
export const AuthError = jest.fn()
export const PostgrestError = jest.fn()
