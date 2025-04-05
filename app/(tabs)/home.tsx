import messaging from '@react-native-firebase/messaging'
import { View, Text, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import ChatFeature from '@/src/components/sreens/chat/view/ChatFeature'
import { router } from 'expo-router'
import { useAuth } from '@/src/context/auth/useAuth'
import { useSocket } from '@/src/context/socket/useSocket'

const Index = () => {

  return (
      <ChatFeature />
  )
}

export default Index