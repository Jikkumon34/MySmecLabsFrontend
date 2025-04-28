// app/(main)/layout.tsx
import Navbar from '@/components/Navbar';

export default function CoursesLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div>
              <Navbar />
        <div className="flex flex-col  mt-16 ">
        <main>{children}</main>
            </div>
      
 
      
      </div>
    );
  }