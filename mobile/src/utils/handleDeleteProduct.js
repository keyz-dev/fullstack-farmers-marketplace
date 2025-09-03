import { Alert } from "react-native";
export const handleDeleteProduct = (productId, deleteProduct) => {
    Alert.alert(
        "Delete Product",
        "Are you sure you want to delete this product? This action cannot be undone.",
        [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        const response = await deleteProduct(productId);
                        if (response.success) {
                            Alert.alert("Success", "Product deleted successfully");
                        } else {
                            Alert.alert(
                                "Error",
                                response.message || "Failed to delete product"
                            );
                        }
                    } catch (error) {
                        Alert.alert("Error", "Failed to delete product");
                    }
                },
            },
        ]
    );
};