import { AuthProvider, ProductProvider, CategoryProvider, CartProvider, FavoritesProvider, OrderProvider } from "./contexts";

import React from 'react'

const AppProviders = ({children}) => (
    <AuthProvider>
        <ProductProvider>
            <CategoryProvider>
                <CartProvider>
                    <FavoritesProvider>
                        <OrderProvider>
                            {children}
                        </OrderProvider>
                    </FavoritesProvider>
                </CartProvider>
            </CategoryProvider>
        </ProductProvider>
    </AuthProvider>
)

export default AppProviders
