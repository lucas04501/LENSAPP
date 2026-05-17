import { Metadata } from "next";
import { AnalyticsContent } from "@/components/dashboard/analytics/AnalyticsContent";

export const metadata: Metadata = {
  title: "Analytics | LENS",
};

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
