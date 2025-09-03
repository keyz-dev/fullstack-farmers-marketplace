import { Alert } from "react-native";

/**
 * Validates farmer-specific required fields
 * @param {Object} values - Form values object
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
const validateFarmerFields = (values) => {
    const errors = [];

    // Required fields validation
    const requiredFields = [
        'name', 'email', 'password', 'confirmPassword',
        'phone', 'address', 'gender', 'farmName',
        'deliveryRadiusKm', 'locationZone', 'produceTypes'
    ];

    requiredFields.forEach(field => {
        if (!values[field] || (Array.isArray(values[field]) && values[field].length === 0)) {
            errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        }
    });

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (values.email && !emailRegex.test(values.email)) {
        errors.push('Please enter a valid email address');
    }

    // Password confirmation validation
    if (values.password !== values.confirmPassword) {
        errors.push('Passwords do not match');
    }

    // Phone number validation (basic)
    const phoneRegex = /^\d{9,15}$/;
    if (values.phone && !phoneRegex.test(values.phone.replace(/\s+/g, ''))) {
        errors.push('Please enter a valid phone number');
    }

    // Delivery radius validation
    if (values.deliveryRadiusKm && (isNaN(values.deliveryRadiusKm) || values.deliveryRadiusKm <= 0)) {
        errors.push('Delivery radius must be a positive number');
    }

    // Location zone validation
    const validLocationZones = ['urban', 'semi_urban', 'rural'];
    if (values.locationZone && !validLocationZones.includes(values.locationZone)) {
        errors.push('Location zone must be one of: urban, semi_urban, rural');
    }

    // Produce types validation
    const validProduceTypes = [
        'vegetables', 'fruits', 'grains', 'dairy', 'poultry',
        'livestock', 'herbs', 'nuts', 'legumes', 'root_crops'
    ];
    if (values.produceTypes && Array.isArray(values.produceTypes)) {
        const invalidTypes = values.produceTypes.filter(type => !validProduceTypes.includes(type));
        if (invalidTypes.length > 0) {
            errors.push(`Invalid produce types: ${invalidTypes.join(', ')}`);
        }
    }

    // Shop coordinates validation
    if (values.shopCoordinates) {
        const { lat, lng } = values.shopCoordinates;
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            errors.push('Shop coordinates must have valid latitude and longitude');
        }
        if (lat < -90 || lat > 90) {
            errors.push('Latitude must be between -90 and 90');
        }
        if (lng < -180 || lng > 180) {
            errors.push('Longitude must be between -180 and 180');
        }
    }

    // Payment method validation
    if (values.payment) {
        const validPaymentMethods = ['mobile_money', 'bank_transfer', 'cash'];
        if (!values.payment.method || !validPaymentMethods.includes(values.payment.method)) {
            errors.push('Payment method must be one of: mobile_money, bank_transfer, cash');
        }

        if (!values.payment.accountName || !values.payment.accountNumber) {
            errors.push('Payment account name and number are required');
        }

        // Account number validation (basic)
        if (values.payment.accountNumber && !/^\d{6,20}$/.test(values.payment.accountNumber)) {
            errors.push('Account number must be 6-20 digits');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Processes avatar file for FormData
 * @param {string} avatarUri - Avatar file URI
 * @returns {Object|null} - Formatted file object or null
 */
const processAvatarFile = (avatarUri) => {
    if (!avatarUri) return null;

    try {
        const filename = avatarUri.split("/").pop() || `avatar_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const extension = match ? match[1].toLowerCase() : 'jpg';

        // Validate image file extensions
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const fileType = validExtensions.includes(extension) ? `image/${extension}` : 'image/jpeg';

        return {
            uri: avatarUri,
            type: fileType,
            name: filename,
        };
    } catch (error) {
        console.warn('Error processing avatar file:', error);
        return null;
    }
};

/**
 * Formats date to ISO string with validation
 * @param {Date|string} date - Date object or string
 * @returns {string|null} - ISO string or null
 */
const formatDateForAPI = (date) => {
    if (!date) return null;

    try {
        const dateObj = date instanceof Date ? date : new Date(date);

        // Validate date is not in the future and person is at least 16 years old
        const now = new Date();
        const minAge = new Date(now.getFullYear() - 16, now.getMonth(), now.getDate());

        if (dateObj > now) {
            throw new Error('Date of birth cannot be in the future');
        }

        if (dateObj > minAge) {
            throw new Error('Must be at least 16 years old to register as a farmer');
        }

        return dateObj.toISOString();
    } catch (error) {
        console.warn('Error formatting date:', error);
        return null;
    }
};

/**
 * Main farmer registration handler
 * @param {Object} values - Form values containing farmer registration data
 * @param {Function} register - Registration function to call with FormData
 * @returns {Promise<void>}
 */
export const handleFarmerSignUp = async (values, register, navigation) => {
    try {
        // Validate all farmer fields
        const validation = validateFarmerFields(values);
        if (!validation.isValid) {
            Alert.alert(
                "Validation Error",
                validation.errors.join('\n'),
                [{ text: "OK" }]
            );
            return;
        }

        // Create FormData instance
        const formData = new FormData();

        // Basic required fields
        formData.append("role", "farmer");
        formData.append("name", values.name.trim());
        formData.append("email", values.email.toLowerCase().trim());
        formData.append("password", values.password);
        formData.append("confirmPassword", values.confirmPassword);
        formData.append("phone", values.phone.replace(/\s+/g, ''));
        formData.append("address", values.address.trim());
        formData.append("gender", values.gender);

        // Farmer-specific required fields
        formData.append("farmName", values.farmName.trim());
        formData.append("deliveryRadiusKm", values.deliveryRadiusKm.toString());
        formData.append("locationZone", values.locationZone);
        formData.append("shopAddress", values.shopAddress.trim());

        // Handle produce types array
        formData.append("produceTypes", JSON.stringify(values.produceTypes));

        // Optional fields with fallbacks
        if (values.whatsapp) {
            formData.append("whatsapp", values.whatsapp.replace(/\s+/g, ''));
        }

        if (values.shopDescription) {
            formData.append("shopDescription", values.shopDescription.trim());
        }

        if (values.websiteURL) {
            // Basic URL validation
            const urlPattern = /^https?:\/\/.+/;
            if (urlPattern.test(values.websiteURL)) {
                formData.append("websiteURL", values.websiteURL.trim());
            }
        }

        // Handle date of birth with validation
        const formattedDob = formatDateForAPI(values.dob);
        if (formattedDob) {
            formData.append("dob", formattedDob);
        }

        // Handle shop coordinates (nested object)
        if (values.addressCoordinates && values.addressCoordinates.lat && values.addressCoordinates.lng) {
            formData.append("addressCoordinates", JSON.stringify({
                lat: parseFloat(values.addressCoordinates.lat),
                lng: parseFloat(values.addressCoordinates.lng)
            }));
        }
        if (values.shopCoordinates && values.shopCoordinates.lat && values.shopCoordinates.lng) {
            formData.append("shopCoordinates", JSON.stringify({
                lat: parseFloat(values.shopCoordinates.lat),
                lng: parseFloat(values.shopCoordinates.lng)
            }));
        }

        // Handle payment information (nested object)
        if (values.payment && values.payment.method && values.payment.accountName && values.payment.accountNumber) {
            const paymentData = {
                method: values.payment.method,
                accountName: values.payment.accountName.trim(),
                accountNumber: values.payment.accountNumber.replace(/\s+/g, '')
            };
            formData.append("payment", JSON.stringify(paymentData));
        }

        // Handle avatar file with comprehensive validation
        const avatarFile = processAvatarFile(values.avatar);
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        // Debug logging for development
        if (__DEV__) {
            console.log('Farmer registration FormData prepared:', {
                role: 'farmer',
                name: values.name,
                email: values.email,
                farmName: values.farmName,
                produceTypes: values.produceTypes,
                deliveryRadiusKm: values.deliveryRadiusKm,
                hasAvatar: !!avatarFile,
                hasPayment: !!(values.payment?.method),
                hasCoordinates: !!(values.shopCoordinates?.lat)
            });
        }

        // Call the register function
        await register(formData);
        Alert.alert(
            "Registration Successful",
            "You have successfully registered. Please check your email for verification.",
            [
                {
                    text: "OK",
                    onPress: () => {
                        navigation.navigate("Home");
                    }
                }
            ]
        );

    } catch (error) {
        console.error('Farmer registration error:', error);

        // Determine appropriate error message
        let errorMessage = "Registration failed. Please check your information and try again.";

        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error?.message) {
            errorMessage = error.message;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.response?.status === 400) {
            errorMessage = "Invalid registration data. Please check all fields.";
        } else if (error?.response?.status === 409) {
            errorMessage = "This email or phone number is already registered.";
        } else if (error?.response?.status >= 500) {
            errorMessage = "Server error. Please try again later.";
        }

        Alert.alert(
            "Registration Failed",
            errorMessage,
            [
                {
                    text: "OK",
                    onPress: () => {
                        console.log('Farmer registration error alert dismissed');
                    }
                }
            ]
        );
    }
};

// Export validation function for use in forms
export { validateFarmerFields };