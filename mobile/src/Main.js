import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStack, AppStack } from "./navigation";
import Toast from "react-native-toast-message";
import { useAuth } from "./stateManagement/contexts";
import { Loader } from "./components";

const Main = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <Loader />
        )
    }

    return (
        <NavigationContainer>

            {user ? <AppStack /> : <AuthStack />}
            <Toast position="top" />
        </NavigationContainer>
    );
}
export default Main;