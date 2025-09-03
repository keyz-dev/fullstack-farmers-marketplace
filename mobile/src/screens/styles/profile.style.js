import { StyleSheet } from "react-native"
import {COLORS, SIZES} from '../../constants'

const styles = StyleSheet.create({
    loginBtn: {
        backgroundColor: COLORS.secondary,
        padding: 2,
        borderWidth: 0.4,
        borderColor: COLORS.primary,
        borderRadius: SIZES.xLarge
    },  
    menuText: {
        fontFamily: 'regular',
        color: COLORS.gray,
        paddingHorizontal: 20,
        fontWeight: '600',
        fontSize: SIZES.medium,
        lineHeight: 26
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite
    },
    cover: {
        height: 290,
        width: '100%',
        resizeMode: "cover"
    },
    profileContainer: {
        flex: 1,
        alignItems: "center"
    },
    profile: {
        height: 155,
        width: 155,
        borderRadius: 999,
        borderColor: COLORS.primary,
        borderWidth: 2,
        resizeMode: "cover",
        marginTop: -90
    },
    name: {
        marginVertical: 5,
        fontFamily: 'bold',
        marginVertical: 5
    }
})

export default styles