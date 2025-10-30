import React from "react";
import { Purchase } from "@/api/purchases";

interface PurchaseStatusProps {
  purchase: Purchase;
  showDetails?: boolean;
}

export default function PurchaseStatus({
  purchase,
  showDetails = false,
}: PurchaseStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "rejected":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "pending":
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
              purchase.status
            )}`}
          >
            {getStatusIcon(purchase.status)}
            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
          </span>
          <span className="text-sm text-gray-600">{purchase.price} DA</span>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(purchase.created_at)}
        </span>
      </div>

      {showDetails && (
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Chapter ID:</span>{" "}
            {purchase.chapter_id}
          </div>
          <div>
            <span className="font-medium">Module ID:</span> {purchase.module_id}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {purchase.phone}
          </div>
          {purchase.reviewed_by && (
            <div>
              <span className="font-medium">Reviewed by:</span>{" "}
              {purchase.reviewed_by}
            </div>
          )}
          {purchase.reviewed_at && (
            <div>
              <span className="font-medium">Reviewed at:</span>{" "}
              {formatDate(purchase.reviewed_at)}
            </div>
          )}
          {purchase.rejection_reason && (
            <div className="text-red-600">
              <span className="font-medium">Rejection reason:</span>{" "}
              {purchase.rejection_reason}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
