"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Always send users visiting /admin to the professor admin page
    router.replace("/professor/professor-management");
  }, [router]);

  return null;
}
