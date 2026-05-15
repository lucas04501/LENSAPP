import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { OnboardingContent } from "@/components/dashboard/OnboardingContent";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Double check if user really has no habits, though logic is usually on dashboard
  // But we can just render the onboarding content here.

  return <OnboardingContent user={session.user as any} />;
}
