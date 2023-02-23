import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Lottie from 'lottie-react-native';


const Loading = () => {
  
  return (

        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
                <Lottie source={require('../../assets/loader.json')} autoPlay loop />
        </View>
      
  )
}

export default Loading

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex:9999,
    }
})