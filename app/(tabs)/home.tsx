import messaging from '@react-native-firebase/messaging'
import { View, Text, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import ChatFeature from '@/src/components/sreens/chat/view/ChatFeature'
import { router } from 'expo-router'
import { useAuth } from '@/src/context/auth/useAuth'
import { useSocket } from '@/src/context/socket/useSocket'

const Index = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const {user} = useAuth()
  const {isConnected, setUserOnline} = useSocket()

  useEffect(() => {
    const getToken = async () => {
      const token = await messaging().getToken()
      setFcmToken(token)
      console.log('FCM Token:', token)
    }

    getToken()
  }, [])

  useEffect(() => {
    if (user && isConnected) {
      if (user?._id) {
        setUserOnline(user._id)
      }
    }
    
  }
  , [user, isConnected])

  return (
    // <View>
    //   <Text>FCM Token:</Text>
    //   <Text>{fcmToken || 'Chưa có token'}</Text>
    // <ChatFeature /></View>
      <ChatFeature />
  
    
  )
}

export default Index