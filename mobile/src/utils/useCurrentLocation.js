import * as Location from "expo-location";

export const useCurrentLocation = async (setShowUseLocation, setIsLoadingLocation) => {
    setShowUseLocation(false);
    setIsLoadingLocation(true);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        throw new Error("Permission Denied");
    }

    try {
        // 2. Get Coordinates
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // 3. Reverse Geocode to get Address
        let addressResult = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
        });

        if (addressResult.length > 0) {
            const adr = addressResult[0];
            const formattedAddress = `${adr.street || ""}, ${adr.city || ""}, ${adr.region || ""
                }, ${adr.country || ""}`;

            return {
                formattedAddress,
                latitude,
                longitude,
            };
        }
    } catch (error) {
        throw error;
    } finally {
        setIsLoadingLocation(false);
    }
};


