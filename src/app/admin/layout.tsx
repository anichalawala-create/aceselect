import type { Metadata } from "next";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "ACE SELECT Admin Panel",
  description: "ACE SELECT CMS Administration Panel",
  robots: "noindex, nofollow", // Never index admin pages
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
