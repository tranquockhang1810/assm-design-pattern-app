import messaging from '@react-native-firebase/messaging'
import { View, Text, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import ChatFeature from '@/src/components/sreens/chat/view/ChatFeature'
import { router } from 'expo-router'
import { useAuth } from '@/src/context/auth/useAuth'

const Index = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const {onLogout} = useAuth()

  useEffect(() => {
    const getToken = async () => {
      const token = await messaging().getToken()
      setFcmToken(token)
      console.log('FCM Token:', token)
    }

    getToken()
  }, [])

  return (
    // <View>
    //   <Text>FCM Token:</Text>
    //   <Text>{fcmToken || 'Chưa có token'}</Text>
    // <ChatFeature /></View>
      <ChatFeature />
  
    
  )
}

export default Index