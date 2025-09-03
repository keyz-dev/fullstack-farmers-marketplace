import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 100, // make space for button
    },
    upperRow: {
        position: 'absolute',
        top: SIZES.xxLarge,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        zIndex: 1,
        width: '100%',
        padding: 16,
    },
    favoriteIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: COLORS.lightWhite,
    },
    image: {
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    details: {
        marginTop: -SIZES.large,
        backgroundColor: COLORS.lightWhite,
        borderTopLeftRadius: SIZES.medium,
        borderTopRightRadius: SIZES.medium,
        width: SIZES.width,
    },
    titleRow: {
        marginHorizontal: 20,
        paddingBottom: SIZES.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: SIZES.width - 44,
        top: 20
    },
    name: {
        fontFamily: 'bold',
        fontSize: SIZES.large,
    },
    priceWrapper: {
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.large
    },
    price: {
        paddingHorizontal: 10,
        fontFamily: "semibold",
        fonstSize: SIZES.xLarge
    },
    ratingRow:{
        paddingBottom: SIZES.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: SIZES.width - 10,
        top: 5
    },
    rating: {
        top: SIZES.large,
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: SIZES.large
    },
    ratingText: {
        color: COLORS.gray,
        fontFamily: 'medium',
        paddingHorizontal: SIZES.xSmall
    },  
    descriptionWrapper: {
        marginTop: SIZES.large*2,
        marginHorizontal: SIZES.large
    },
    descriptionTitle: {
        fontFamily: 'medium',
        fontSize: SIZES.large - 2,
    },
    description: {
        fontFamily: 'regular',
        fontSize: SIZES.medium-3,
        textAlign: 'justify',
        color: COLORS.gray,
        marginBottom: SIZES.small
    },

    location: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: SIZES.small,
        backgroundColor: COLORS.secondary,
        padding: 5,
        borderRadius: SIZES.large
        
    },  

    addButton: {
        fontFamily: 'regular',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    removeButton: {
        fontFamily: 'regular',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: COLORS.gray2,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: 'bold',
    },
    removeButtonText: {
        color: COLORS.primary,
        fontSize: 18,
        fontFamily: 'bold',
    },
    // Thumbnail Gallery Styles
    thumbnailContainer: {
        backgroundColor: COLORS.lightWhite,
        paddingVertical: SIZES.small,
        borderTopLeftRadius: SIZES.medium,
        borderTopRightRadius: SIZES.medium,
        marginTop: -SIZES.large,
    },
    thumbnailList: {
        paddingHorizontal: SIZES.medium,
        gap: SIZES.small,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: SIZES.small,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
        position: 'relative',
    },
    selectedThumbnail: {
        borderColor: COLORS.primary,
        borderWidth: 3,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    // Vendor Information Styles
    vendorWrapper: {
        marginTop: SIZES.large,
        marginHorizontal: SIZES.large,
        marginBottom: SIZES.medium,
    },
    vendorTitle: {
        fontFamily: 'medium',
        fontSize: SIZES.large - 2,
        marginBottom: SIZES.small,
    },
    vendorCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.medium,
        padding: SIZES.medium,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    vendorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.medium,
    },
    vendorAvatar: {
        marginRight: SIZES.medium,
    },
    vendorDetails: {
        flex: 1,
    },
    vendorName: {
        fontFamily: 'semibold',
        fontSize: SIZES.medium,
        color: COLORS.black,
        marginBottom: 4,
    },
    vendorLocation: {
        fontFamily: 'regular',
        fontSize: SIZES.small,
        color: COLORS.gray,
        marginBottom: 4,
    },
    vendorRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vendorRatingText: {
        fontFamily: 'regular',
        fontSize: SIZES.small,
        color: COLORS.gray,
        marginLeft: 4,
    },
    contactButtons: {
        gap: SIZES.small,
    },
    whatsappButton: {
        backgroundColor: '#25D366',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.small,
        gap: SIZES.xSmall,
    },
    whatsappButtonText: {
        color: COLORS.white,
        fontFamily: 'medium',
        fontSize: SIZES.small,
    },
    callButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.small,
        gap: SIZES.xSmall,
    },
    callButtonText: {
        color: COLORS.white,
        fontFamily: 'medium',
        fontSize: SIZES.small,
    },
  });

export default styles;
