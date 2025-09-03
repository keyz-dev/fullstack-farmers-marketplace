import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/config";

// Create the context
const CategoryContext = createContext();

// Provider component
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Fetch all categories
  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/category/");
      setCategories(res.data.data);
      setError(null);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setError(err.response.data.message || "Failed to fetch categories");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch single category by id
  const fetchCategoryById = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/category/${id}`);
      setError(null);
      return res.data.category;
    } catch (err) {
      setError(err.message || "Failed to fetch category");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create category (requires token for vendor)
  const createCategory = async (categoryData, token) => {
    try {
      const res = await api.post("/category/create", categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => [...prev, res.data.category]);
      return res.data.category;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to create category"
      );
    }
  };

  // Update category
  const updateCategory = async (id, categoryData, token) => {
    try {
      const res = await api.put(`/category/${id}`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) =>
        prev.map((prod) => (prod._id === id ? res.data.category : prod))
      );
      return res.data.category;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to update category"
      );
    }
  };

  // Delete category
  const deleteCategory = async (id, token) => {
    try {
      await api.delete(`/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((prod) => prod._id !== id));
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to delete category"
      );
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchAllCategories,
        fetchCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook for easy access
export const useCategories = () => {
  return useContext(CategoryContext);
};
