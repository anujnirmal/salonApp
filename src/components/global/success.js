import { View, Text } from 'react-native'
import React from 'react'
import Lottie from 'lottie-react-native';

const success = () => {
  return (
    <View style={{alignItems:"center"}}>
      <Lottie
      source={require('../../assets/success.json')}
      autoPlay
      loop
      />
    </View>
  )
}

export default success