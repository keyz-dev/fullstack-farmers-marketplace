import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../../../constants';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.medium,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray2,
    },
    backButton: {
        padding: SIZES.small,
    },
    headerTitle: {
        fontSize: SIZES.large,
        fontFamily: 'semibold',
        color: COLORS.primary,
    },
    placeholder: {
        width: 40, // To balance the back button
    },

    // Form Container
    formContainer: {
        padding: SIZES.medium,
    },

    // Section Styles
    section: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.medium,
        padding: SIZES.medium,
        marginBottom: SIZES.medium,
        shadowColor: COLORS.gray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: SIZES.large,
        fontFamily: 'semibold',
        color: COLORS.primary,
        marginBottom: SIZES.small,
    },
    sectionSubtitle: {
        fontSize: SIZES.medium,
        fontFamily: 'regular',
        color: COLORS.gray,
        marginBottom: SIZES.medium,
    },

    // Image Upload
    imagePickerContainer: {
        alignItems: 'center',
        marginBottom: SIZES.medium,
    },
    imagePreviewSection: {
        marginTop: SIZES.medium,
    },
    previewTitle: {
        fontSize: SIZES.medium,
        fontFamily: 'semibold',
        color: COLORS.primary,
        marginBottom: SIZES.small,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: SIZES.small,
    },
    imagePreviewCard: {
        position: 'relative',
        width: 80,
        height: 80,
        marginBottom: SIZES.small,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: SIZES.small,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray2,
    },
    imagePreviewText: {
        fontSize: SIZES.small,
        fontFamily: 'medium',
        color: COLORS.gray,
        textAlign: 'center',
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 2,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },

    // Input Styles
    inputGroup: {
        marginBottom: SIZES.medium,
    },
    inputLabel: {
        fontSize: SIZES.medium,
        fontFamily: 'semibold',
        color: COLORS.primary,
        marginBottom: SIZES.small,
    },
    textInput: {
        borderWidth: 1,
        borderColor: COLORS.gray2,
        borderRadius: SIZES.small,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.medium,
        fontSize: SIZES.medium,
        fontFamily: 'regular',
        color: COLORS.primary,
        backgroundColor: COLORS.white,
    },
    textArea: {
        borderWidth: 1,
        borderColor: COLORS.gray2,
        borderRadius: SIZES.small,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.medium,
        fontSize: SIZES.medium,
        fontFamily: 'regular',
        color: COLORS.primary,
        backgroundColor: COLORS.white,
        minHeight: 100,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        fontSize: SIZES.small,
        fontFamily: 'regular',
        color: COLORS.error,
        marginTop: 4,
    },

    // Row Layout
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    flex1: {
        flex: 1,
    },
    marginRight: {
        marginRight: SIZES.small,
    },

    // Picker Styles
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.gray2,
        borderRadius: SIZES.small,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: COLORS.primary,
    },

    // Switch Row
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SIZES.small,
        marginBottom: SIZES.medium,
    },
    switchLabel: {
        fontSize: SIZES.medium,
        fontFamily: 'semibold',
        color: COLORS.primary,
    },

    // Submit Button
    submitButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.medium,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        marginTop: SIZES.medium,
        marginBottom: SIZES.xLarge,
    },
    submitButtonDisabled: {
        backgroundColor: COLORS.gray,
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        marginLeft: SIZES.small,
        fontSize: SIZES.medium,
        fontFamily: 'semibold',
        color: COLORS.white,
    },
});