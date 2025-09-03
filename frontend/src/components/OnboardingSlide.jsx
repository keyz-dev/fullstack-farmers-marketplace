import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import {SIZES, COLORS } from '../constants'

const OnboardingSlide = ({item}) => {
  return (
    <View style={{alignItems: 'center', width: SIZES.width }}>
      <Image 
        source={item.image}
        style={{height: '75%', width: SIZES.width, resizeMode: 'contain'}}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  )
}

export default OnboardingSlide

const styles = StyleSheet.create({
    title: {
        color: COLORS.primary,
        fontSize: SIZES.large + 4,
        fontFamily: 'bold',
        marginTop: 20,
        textAlign: 'center'
    },
    description: {
        color: COLORS.gray2,
        fontSize: SIZES.small+1,
        marginTop: 10,
        maxWidth: '70%',
        textAlign: 'center', 
        fontFamily: 'regular'
    }
})