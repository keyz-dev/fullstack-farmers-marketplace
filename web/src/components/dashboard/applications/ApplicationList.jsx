"use client";

import React from "react";
import {
  Table,
  Pagination,
  DropdownMenu,
  StatusPill,
  FadeInContainer,
  UserInfo,
} from "../../ui";
import { Eye, CheckCircle, XCircle, Users, Building2 } from "lucide-react";

const ApplicationList = ({
  applications,
  loading,
  error,
  pagination,
  onPageChange,
  onViewDetails,
  onReview,
}) => {
  // Helper functions
  const getBusinessName = (application) => {
    if (application.applicationType === "farmer") {
      return application.farmName || "Farmer Application";
    } else {
      return application.businessName || "Delivery Agent Application";
    }
  };

  const getLocation = (application) => {
    if (application.applicationType === "farmer") {
      return (
        application.farmAddress?.city || "Location not specified"
      );
    } else {
      return application.businessAddress?.city || "Location not specified";
    }
  };

  const getTypeIcon = (application) => {
    return application.applicationType === "farmer" ? (
      <Users className="w-4 h-4" />
    ) : (
      <Building2 className="w-4 h-4" />
    );
  };

  const getTypeLabel = (application) => {
    return application.applicationType === "farmer" ? "Farmer" : "Delivery Agent";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "under_review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "suspended":
        return "Suspended";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No vendor applications found. Applications will appear here once
          submitted.
        </p>
      </div>
    );
  }

  const columns = [
    {
      Header: "Applicant",
      accessor: "applicant",
      Cell: ({ row }) => <UserInfo user={row.user || {}} />,
    },
    {
      Header: "Business",
      accessor: "business",
      Cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(row)}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {getBusinessName(row)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getTypeLabel(row)}
            </p>
          </div>
        </div>
      ),
    },
    {
      Header: "Location",
      accessor: "location",
      Cell: ({ row }) => (
        <span className="text-gray-600 dark:text-gray-300">
          {getLocation(row)}
        </span>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => <StatusPill status={getStatusLabel(row.status)} />,
    },
    {
      Header: "Submitted",
      accessor: "submitted",
      Cell: ({ row }) => (
        <span className="text-gray-600 dark:text-gray-300">
          {formatDate(row.submittedAt)}
        </span>
      ),
    },
    {
      Header: "Documents",
      accessor: "documents",
      Cell: ({ row }) => (
        <span className="text-gray-600 dark:text-gray-300">
          {row.documents?.length || 0} files
        </span>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => {
        const menuItems = [
          {
            label: "View Details",
            icon: <Eye size={16} />,
            onClick: () => onViewDetails(row),
          },
          ...(row.status === "pending" || row.status === "under_review"
            ? [
                {
                  label: "Approve",
                  icon: <CheckCircle size={16} />,
                  onClick: () => onReview(row, "approve"),
                },
                {
                  label: "Reject",
                  icon: <XCircle size={16} />,
                  onClick: () => onReview(row, "reject"),
                  isDestructive: true,
                },
              ]
            : []),
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu items={menuItems} />
          </div>
        );
      },
    },
  ];

  return (
    <FadeInContainer>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Table
          data={applications}
          columns={columns}
          isLoading={loading}
          emptyStateMessage={
            error
              ? "Failed to load applications. Please try refreshing the page."
              : "No applications found. Applications will appear here once submitted."
          }
          onRowClick={(row) => onViewDetails(row)}
          clickableRows={true}
        />

        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
              total={pagination.total}
              limit={pagination.limit}
            />
          </div>
        )}
      </div>
    </FadeInContainer>
  );
};

export default ApplicationList;
