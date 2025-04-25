import Navbar from "@/components/Library/Navbar";
import HeadNavbar from "@/components/Library/HeadNavBar";
import { ReactNode } from "react";
// import HeaderNavbar from "@/components/Library/HeaderNavbar";
import { Course } from "@/types/types";
import Footer from '@/components/Library/Footer';
import { fetchGraphQL } from '@/lib/graphql';


// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const query = `
    query {
       libraryCourses {
        id
        title
        slug
      }
    }
  `;
  const data: { libraryCourses: Course[] } = await fetchGraphQL(query);
  const courses = data.libraryCourses;

  return (
    <div className="min-h-screen">
      <HeadNavbar />
      <Navbar courses={courses} />
      {/* 
        The pt-28 ensures our main content starts 
        below the fixed header & navbar 
      */}
      <main className="pt-22">{children}</main>
      <Footer />
    </div>
  );
}
