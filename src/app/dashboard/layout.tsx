import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardClientWrapper } from "@/components/layout/DashboardClientWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNotifications } from "@/lib/actions/notifications";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("@/components/layout/CommandPalette").then(mod => mod.CommandPalette), {
  ssr: false,
});

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const initialNotifications = session?.user?.id 
    ? await getNotifications(session.user.id) 
    : [];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header initialNotifications={initialNotifications} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
      <DashboardClientWrapper />
    </div>
  );
}
