import { Alert } from "react-native";

export const handleClientSignUp = async (values, register, navigation) => {
    try {
        const formData = new FormData();
        formData.append("role", "client");

        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("confirmPassword", values.confirmPassword);
        formData.append("phone", values.phone);
        formData.append("whatsapp", values.whatsapp);
        formData.append("address", values.address);
        formData.append("gender", values.gender);

        // Handle date properly - add validation
        if (values.dob) {
            formData.append("dob", values.dob.toISOString());
        }

        // Handle nested object (addressCoordinates)
        if (values.addressCoordinates) {
            formData.append(
                "addressCoordinates",
                JSON.stringify(values.addressCoordinates)
            );
        }

        // Handle avatar file with better validation
        if (values.avatar) {
            const filename = values.avatar.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : "image/jpeg";

            const avatarFile = {
                uri: values.avatar,
                type: type,
                name: filename,
            };

            formData.append("avatar", avatarFile);
        }

        await register(formData);
        Alert.alert(
            "Registration Successful",
            "You have successfully registered. Please check your email for verification.",
            [
                {
                    text: "OK",
                    onPress: () => {
                        console.log('Success alert dismissed');
                        navigation.navigate("Home");
                    }
                }
            ]
        );

    } catch (error) {
        let errorMessage = "Something went wrong. Please try again.";

        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error.message) {
            errorMessage = error.message;
        }

        Alert.alert(
            "Registration Failed",
            errorMessage,
            [
                {
                    text: "OK",
                    onPress: () => {
                        console.log('Error alert dismissed');
                    }
                }
            ]
        );
    }
};