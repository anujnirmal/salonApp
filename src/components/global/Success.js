import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import tw from "twrnc";
import Lottie from 'lottie-react-native';

const Success = ({closeBookService}) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Lottie
      source={require('../../assets/success.json')}
      autoPlay
      />
      <View style={tw`mt-120`}>
        <Button onPress={() => closeBookService()} title='Okay'/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      zIndex:9999,
  }
})

export default Success