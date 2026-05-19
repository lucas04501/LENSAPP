import { Metadata } from "next";
import { AnalyticsContent } from "@/components/dashboard/analytics/AnalyticsContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnalyticsData } from "@/lib/actions/analytics";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Analytics | LENS",
};

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const result = await getAnalyticsData(session.user.id);

  return <AnalyticsContent initialData={result.data} />;
}
