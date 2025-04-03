import messaging from '@react-native-firebase/messaging'
import { View, Text, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import MessagesFeature from '@/src/components/sreens/messages/view/MessagesFeature'

const Index = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await messaging().getToken()
      setFcmToken(token)
      console.log('FCM Token:', token)
    }

    getToken()
  }, [])

  return (
    <View>
      <Text>FCM Token:</Text>
      <Text>{fcmToken || 'Chưa có token'}</Text>
      <MessagesFeature />
    </View>
  )
}

export default Index