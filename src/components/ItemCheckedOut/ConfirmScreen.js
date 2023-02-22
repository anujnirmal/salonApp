import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc';

const ConfirmScreen = () => {
  return (
    <View style={tw`w-full h-full`}>
      <Text style={tw`text-center mt-8 text-lg text-white`}>Confirm Appointment</Text>
    </View>
  )
}

export default ConfirmScreen