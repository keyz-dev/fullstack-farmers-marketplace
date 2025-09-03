import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/config";
import { farmerProductsAPI } from "../../api/farmer/product";

// Create the context
const ProductContext = createContext();

// Provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({});
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    category: undefined,
  });

  // Fetch all products
  const fetchAllProducts = async (searchParams = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/product/all", {
        params: {
          keyword: searchParams?.keyword || "",
          category: searchParams.category || undefined,
        },
      });
      // Handle different response structures
      const products = res.data.data || res.data.products || res.data || [];
      setProducts(products);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };
  // Search all products by name
  const searchProducts = async (searchParams = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/product/search", {
        params: {
          keyword: searchParams?.keyword || "",
          category: searchParams.category || undefined,
        },
      });
      // Handle different response structures
      const products = res.data.products || res.data.data || res.data || [];
      setSearchResults(products);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch best sellers
  const fetchBestSellers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product/best-sellers");
      // Handle different response structures
      const products = res.data.products || res.data.data || res.data || [];
      setBestSellers(products);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch best sellers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch new arrivals
  const fetchNewArrivals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product/new-arrivals");
      // Handle different response structures
      const products = res.data.products || res.data.data || res.data || [];
      setNewArrivals(products);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch new arrivals");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single product by id
  const fetchProductById = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/product/${id}`);
      setError(null);
      return res.data.product;
    } catch (err) {
      setError(err.message || "Failed to fetch product");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create product (requires token for vendor)
  const createProduct = async (productData) => {
    try {
      const response = await farmerProductsAPI.addProduct(productData);
      if (response.success) {
        // Refresh farmer products to get the updated list
        await fetchFarmerProducts();
        return response.data.product;
      } else {
        throw new Error(response.message || "Failed to create product");
      }
    } catch (err) {
      throw new Error(
        err.response?.data?.message || err.message || "Failed to create product"
      );
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      const response = await farmerProductsAPI.updateProduct(id, productData);
      if (response.success) {
        // Refresh farmer products to get the updated list
        await fetchFarmerProducts();
        return response.data.product;
      } else {
        throw new Error(response.message || "Failed to update product");
      }
    } catch (err) {
      throw new Error(
        err.response?.data?.message || err.message || "Failed to update product"
      );
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const response = await farmerProductsAPI.deleteProduct(id);
      if (response.success) {
        // Refresh farmer products to get the updated list
        await fetchFarmerProducts();
        return { success: true, message: "Product deleted successfully" };
      } else {
        return { success: false, message: response.message || "Failed to delete product" };
      }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || "Failed to delete product" 
      };
    }
  };

  // Fetch farmer products
  const fetchFarmerProducts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await farmerProductsAPI.getFarmerProducts();

      if (response.success) {
        setProducts(response.data.products);
        setStats(response.data.stats);
      } else {
        setError(response.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching farmer products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchBestSellers();
    fetchNewArrivals();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        // states
        products,
        bestSellers,
        newArrivals,
        loading,
        error,
        searchParams,
        searchResults,
        refreshing,
        stats,

        // actions
        setSearchParams,
        searchProducts,
        fetchAllProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchBestSellers,
        fetchNewArrivals,
        fetchFarmerProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for easy access
export const useProducts = () => {
  return useContext(ProductContext);
};
