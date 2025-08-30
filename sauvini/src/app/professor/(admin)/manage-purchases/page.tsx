"use client";

import PurchasesGrid from "@/components/professor/adminPurchases/PurchasesGrid";
import { purchases } from "@/data/purchases";

export default function Page() {
  return (
    <main className="w-full">
      <PurchasesGrid purchases={purchases} />
    </main>
  );
}