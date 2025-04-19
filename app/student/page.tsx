// app/page.tsx
export default function HomePage() {
  return (
    <main className="p-4 md:p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <div className="bg-[#00A99D] p-4 md:p-6 rounded-lg text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">4</p>
              <p>Current Courses</p>
            </div>
            <span className="material-icons text-4xl">book</span>
          </div>
        </div>
        <div className="bg-[#0071BC] p-4 md:p-6 rounded-lg text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">3</p>
              <p>Pending Assignments</p>
            </div>
            <span className="material-icons text-4xl">assignment</span>
          </div>
        </div>
        <div className="bg-[#2E3192] p-4 md:p-6 rounded-lg text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">89%</p>
              <p>Overall Grade</p>
            </div>
            <span className="material-icons text-4xl">assessment</span>
          </div>
        </div>
        <div className="bg-[#606060] p-4 md:p-6 rounded-lg text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">12d</p>
              <p>Next Exam</p>
            </div>
            <span className="material-icons text-4xl">event</span>
          </div>
        </div>
      </div>
      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h3 className="text-xl font-semibold mb-4 text-[#606060]">
          Recent Activities
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2E3192] text-white">
              <tr>
                <th className="p-2 md:p-3 text-left">Course</th>
                <th className="p-2 md:p-3 text-left">Activity</th>
                <th className="p-2 md:p-3 text-left">Deadline</th>
                <th className="p-2 md:p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-2 md:p-3">Mathematics</td>
                <td className="p-2 md:p-3">Algebra Assignment</td>
                <td className="p-2 md:p-3">2023-12-15</td>
                <td className="p-2 md:p-3 text-[#00A99D]">Submitted</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-2 md:p-3">Physics</td>
                <td className="p-2 md:p-3">Chapter 5 Quiz</td>
                <td className="p-2 md:p-3">2023-12-18</td>
                <td className="p-2 md:p-3 text-[#0071BC]">Pending</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-2 md:p-3">Chemistry</td>
                <td className="p-2 md:p-3">Lab Report</td>
                <td className="p-2 md:p-3">2023-12-20</td>
                <td className="p-2 md:p-3 text-[#606060]">Not Started</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
