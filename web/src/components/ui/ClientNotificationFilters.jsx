import React from "react";
import { useNotificationContext } from "../../contexts/NotificationContext";
import AdvancedFilters from "./AdvancedFilters";

const ClientNotificationFilters = ({
  filters,
  onFilterChange,
  onSearch,
  onClearAll,
  loading = false,
  refreshNotifications = null,
}) => {
  const { allowedTypes, categories } = useNotificationContext();

  // Client-specific notification type options
  const getClientTypeOptions = () => {
    const typeLabels = {
      order_confirmation: "Order Confirmation",
      order_shipped: "Order Shipped",
      order_delivered: "Order Delivered",
      order_cancelled: "Order Cancelled",
      booking_confirmed: "Booking Confirmed",
      booking_reminder: "Booking Reminder",
      booking_cancelled: "Booking Cancelled",
      payment_successful: "Payment Successful",
      payment_failed: "Payment Failed",
      account_verification: "Account Verification",
      password_reset: "Password Reset",
      system: "System Messages",
      promotion: "Promotions",
      announcement: "Announcements",
    };

    return [
      { value: "all", label: "All Types" },
      ...allowedTypes
        .filter((type) => typeLabels[type])
        .map((type) => ({
          value: type,
          label: typeLabels[type],
        })),
    ];
  };

  // Client-specific category options
  const getClientCategoryOptions = () => {
    const categoryLabels = {
      orders: "Orders",
      bookings: "Bookings",
      payments: "Payments",
      account: "Account",
      system: "System",
      promotions: "Promotions",
    };

    return [
      { value: "all", label: "All Categories" },
      ...categories
        .filter((category) => categoryLabels[category])
        .map((category) => ({
          value: category,
          label: categoryLabels[category],
        })),
    ];
  };

  const filterConfigs = [
    {
      key: "type",
      label: "Type",
      defaultValue: "all",
      options: getClientTypeOptions(),
    },
    {
      key: "category",
      label: "Category",
      defaultValue: "all",
      options: getClientCategoryOptions(),
    },
    {
      key: "priority",
      label: "Priority",
      defaultValue: "all",
      options: [
        { value: "all", label: "All Priorities" },
        { value: "urgent", label: "Urgent" },
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" },
      ],
    },
    {
      key: "status",
      label: "Status",
      defaultValue: "all",
      options: [
        { value: "all", label: "All Status" },
        { value: "unread", label: "Unread" },
        { value: "read", label: "Read" },
      ],
    },
  ];

  return (
    <AdvancedFilters
      filters={filters}
      onFilterChange={onFilterChange}
      onSearch={onSearch}
      onClearAll={onClearAll}
      filterConfigs={filterConfigs}
      searchPlaceholder="Search your notifications..."
      loading={loading}
      refreshApplications={refreshNotifications}
    />
  );
};

export default ClientNotificationFilters;
