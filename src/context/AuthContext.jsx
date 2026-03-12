import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await updateStreak(user.uid)
      }
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const updateStreak = async (uid) => {
    const today = new Date().toDateString()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const streakRef = doc(db, 'streak', uid)
    const streakSnap = await getDoc(streakRef)

    if (streakSnap.exists()) {
      const { lastDate, count } = streakSnap.data()
      if (lastDate === today) {
        // Already logged in today, do nothing
      } else if (lastDate === yesterday.toDateString()) {
        // Consecutive day!
        await setDoc(streakRef, { lastDate: today, count: count + 1 })
      } else {
        // Streak broken
        await setDoc(streakRef, { lastDate: today, count: 1 })
      }
    } else {
      // First login ever
      await setDoc(streakRef, { lastDate: today, count: 1 })
    }
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}