import { Metadata } from "next";
import { SocialContent } from "@/components/dashboard/social/SocialContent";

export const metadata: Metadata = {
  title: "Gym Rats | LENS",
};

export default function SocialPage() {
  return <SocialContent />;
}
