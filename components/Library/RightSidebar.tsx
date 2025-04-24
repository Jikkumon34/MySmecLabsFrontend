const RightSidebar = () => {
    return (
      <div className="w-40 min-h-screen bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 px-2">Right Sidebar</h2>
          <nav className="space-y-2">
            <a href="#" className="block px-2 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              Additional Item 1
            </a>
            <a href="#" className="block px-2 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900">
              Additional Item 2
            </a>
          </nav>
        </div>
      </div>
    );
  };
  
  export default RightSidebar;
  