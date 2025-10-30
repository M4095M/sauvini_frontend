import type {
  Purchase as ApiPurchase,
  PurchaseWithDetails as ApiPurchaseWithDetails,
} from "@/api/purchases";

/**
 * Frontend Purchase type with formatted display fields
 */
export interface FrontendPurchase {
  id: string;
  moduleName: string;
  chapterName: string;
  price: string;
  phone: string;
  receipt: string;
  date: string;
  time: string;
  status: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentStream: string;
  // Keep the raw data for API updates
  raw?: ApiPurchaseWithDetails;
}

/**
 * Convert API purchase to frontend display format
 */
export function mapApiPurchaseToFrontend(
  purchase: ApiPurchaseWithDetails
): FrontendPurchase {
  const createdAt = purchase.created_at
    ? new Date(purchase.created_at)
    : new Date();

  const date = createdAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const time = createdAt.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Extract ID from RecordId format if needed
  let id = purchase.id || "";
  if (typeof id === "object" && id !== null && "id" in id) {
    id = (id as any).id || String(id);
  } else {
    id = String(id);
  }

  // Map status to display format
  const statusMap: Record<string, string> = {
    pending: "New",
    approved: "Validated",
    rejected: "Rejected",
  };

  const displayStatus = statusMap[purchase.status] || purchase.status;

  return {
    id,
    moduleName: purchase.module_name || "",
    chapterName: purchase.chapter_name || "",
    price: `${purchase.price.toFixed(2)} DZD`,
    phone: purchase.phone || "",
    receipt: purchase.receipt_url || "",
    date,
    time,
    status: displayStatus,
    studentId: purchase.student_id || "",
    studentName: purchase.student_name || "",
    studentEmail: purchase.student_email || "",
    studentPhone: purchase.student_phone || "",
    studentStream: purchase.student_stream || "",
    raw: purchase,
  };
}

/**
 * Convert frontend purchase back to API format for updates
 */
export function mapFrontendPurchaseToApi(
  purchase: FrontendPurchase
): Partial<ApiPurchaseWithDetails> {
  // Reverse the status mapping
  const statusMap: Record<string, "pending" | "approved" | "rejected"> = {
    New: "pending",
    Validated: "approved",
    Rejected: "rejected",
  };

  return {
    id: purchase.id,
    student_id: purchase.studentId,
    chapter_id: purchase.raw?.chapter_id,
    module_id: purchase.raw?.module_id,
    price: parseFloat(purchase.price.replace(/[^\d.]/g, "")),
    phone: purchase.phone,
    receipt_url: purchase.receipt,
    status: statusMap[purchase.status] || "pending",
  };
}
