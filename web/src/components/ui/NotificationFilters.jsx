import React from "react";
import { useNotificationContext } from "../../contexts/NotificationContext";
import AdvancedFilters from "./AdvancedFilters";

const NotificationFilters = ({
  filters,
  onFilterChange,
  onSearch,
  onClearAll,
  loading = false,
  refreshNotifications = null,
}) => {
  const { allowedTypes, categories } = useNotificationContext();

  // Admin-specific notification type options
  const getAdminTypeOptions = () => {
    const typeLabels = {
      vendor_application_submitted: "Vendor Application Submitted",
      vendor_application_reviewed: "Vendor Application Reviewed",
      vendor_application_approved: "Vendor Application Approved",
      vendor_application_rejected: "Vendor Application Rejected",
      new_user_registered: "New User Registered",
      order_dispute_reported: "Order Dispute Reported",
      booking_dispute_reported: "Booking Dispute Reported",
      system_alert: "System Alert",
      platform_maintenance: "Platform Maintenance",
      security_alert: "Security Alert",
      user_reported: "User Reported",
      vendor_reported: "Vendor Reported",
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

  // Admin-specific category options
  const getAdminCategoryOptions = () => {
    const categoryLabels = {
      vendor_applications: "Vendor Applications",
      orders: "Orders",
      bookings: "Bookings",
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
      options: getAdminTypeOptions(),
    },
    {
      key: "category",
      label: "Category",
      defaultValue: "all",
      options: getAdminCategoryOptions(),
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
      searchPlaceholder="Search notifications..."
      loading={loading}
      refreshApplications={refreshNotifications}
    />
  );
};

export default NotificationFilters;
