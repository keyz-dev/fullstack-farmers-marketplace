// utils/formatUserData.js

const { formatImageUrl } = require("../imageUtils.js");

/**
 * Formats a Mongoose user document into a clean, role-specific object for API responses.
 *
 * @param {object} user - The Mongoose user document.
 * @returns {object} A clean object with fields appropriate for the user's role.
 */
const formatUserData = (user) => {
    // 1. Define the base information shared by ALL users.
    const baseData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        gender: user.gender,
        address: user.address,
        dob: user.dob,
        role: user.role,
        locationZone: user.locationZone,
        addressCoordinates: user.addressCoordinates,
        status: user.status,
        avatar: formatImageUrl(user.avatar),
        createdAt: user.createdAt,
    };

    // 2. Use a switch statement to add role-specific fields.
    switch (user.role) {
        case 'farmer':
            return {
                ...baseData,
                farmName: user.farmName,
                websiteURL: user.websiteURL,
                shopDescription: user.shopDescription,
                shopCoordinates: user.shopCoordinates,
                produceTypes: user.produceTypes,
                deliveryRadiusKm: user.deliveryRadiusKm,
                payment: user.payment,
            };

        case 'delivery_agent':
            return {
                ...baseData,
                vehicleType: user.vehicleType,
                maxDeliveryDistanceKm: user.maxDeliveryDistanceKm,
                deliveryZone: user.deliveryZone,
                currentLocation: user.currentLocation,
                isAvailable: user.isAvailable,
            };

        case 'admin':
            // Admins might get all base data plus some extra privileges
            // but for now, baseData is sufficient.
            return {
                ...baseData,
                // You could add admin-specific fields here if any
            };

        case 'client':
        default:
            // The 'client' role just gets the base data.
            return baseData;
    }
};

module.exports = formatUserData;