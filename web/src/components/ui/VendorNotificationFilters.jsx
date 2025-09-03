import React from "react";
import { useNotificationContext } from "../../contexts/NotificationContext";
import AdvancedFilters from "./AdvancedFilters";

const VendorNotificationFilters = ({
  filters,
  onFilterChange,
  onSearch,
  onClearAll,
  loading = false,
  refreshNotifications = null,
}) => {
  const { allowedTypes, categories } = useNotificationContext();

  // Vendor-specific notification type options
  const getVendorTypeOptions = () => {
    const typeLabels = {
      new_order_received: "New Order Received",
      order_status_update: "Order Status Update",
      new_booking_request: "New Booking Request",
      booking_confirmed_by_client: "Booking Confirmed by Client",
      booking_cancelled_by_client: "Booking Cancelled by Client",
      payment_received: "Payment Received",
      product_approved: "Product Approved",
      product_rejected: "Product Rejected",
      service_approved: "Service Approved",
      service_rejected: "Service Rejected",
      vendor_application_approved: "Application Approved",
      vendor_application_rejected: "Application Rejected",
      vendor_account_suspended: "Account Suspended",
      vendor_account_reactivated: "Account Reactivated",
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

  // Vendor-specific category options
  const getVendorCategoryOptions = () => {
    const categoryLabels = {
      orders: "Orders",
      bookings: "Bookings",
      payments: "Payments",
      vendor_applications: "Vendor Applications",
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
      options: getVendorTypeOptions(),
    },
    {
      key: "category",
      label: "Category",
      defaultValue: "all",
      options: getVendorCategoryOptions(),
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

export default VendorNotificationFilters;
