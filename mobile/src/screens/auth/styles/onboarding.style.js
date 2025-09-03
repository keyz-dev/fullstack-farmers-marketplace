import { StyleSheet } from "react-native";
import {COLORS, SIZES} from '../../../constants'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    image: {
      width: SIZES.width,
      height: SIZES.height * 0.5,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingTop: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#777',
      textAlign: 'center',
      marginBottom: 40,
    },
    button: {
      backgroundColor: '#007bff',
      paddingVertical: 15,
      paddingHorizontal: 60,
      borderRadius: 30,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  

export default styles