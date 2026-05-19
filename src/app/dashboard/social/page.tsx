import { Metadata } from "next";
import { SocialContent } from "@/components/dashboard/social/SocialContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPosts } from "@/lib/actions/social";

export const metadata: Metadata = {
  title: "Feed | LENS",
};

export default async function SocialPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const posts = await getPosts(session.user.id);

  return <SocialContent initialPosts={posts} />;
}
