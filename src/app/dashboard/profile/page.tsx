import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFullProfile } from "@/lib/actions/user";
import { ProfileContent } from "@/components/dashboard/ProfileContent";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const res = await getFullProfile(userId);

  if (!res.success || !res.data) {
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">Erro ao carregar perfil</h1>
        <p className="text-text-muted mt-2">Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return <ProfileContent data={res.data} />;
}
