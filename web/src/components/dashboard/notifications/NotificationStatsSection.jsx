import React from "react";
import { Bell, CheckCircle, AlertCircle, Clock } from "lucide-react";
import StatRenderer from "@/components/ui/StatRenderer";

const NotificationStatsSection = ({ stats, loading }) => {
  return (
    <StatRenderer
      statCards={[
        {
          title: "Total Notifications",
          value: stats.total,
          description: "All system notifications",
          icon: Bell,
          colorTheme: "blue",
        },
        {
          title: "Read",
          value: stats.total - stats.unread,
          description: "Notifications marked as read",
          icon: CheckCircle,
          colorTheme: "green",
        },
        {
          title: "Unread",
          value: stats.unread,
          description: "Pending notifications",
          icon: AlertCircle,
          colorTheme: "red",
        },
        {
          title: "High Priority",
          value: stats.high + stats.urgent,
          description: "Urgent notifications",
          icon: Clock,
          colorTheme: "orange",
        },
      ]}
      isLoading={loading}
    />
  );
};

export default NotificationStatsSection;
