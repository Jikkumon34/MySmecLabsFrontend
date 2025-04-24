// components/Hero.tsx
export default function Hero() {
  return (
    <div className="m-0 p-0">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-indigo-100 to-white w-full overflow-hidden">
        {/* Hero Content */}
        <div className="text-center px-4 pt-20 pb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Learn to Code</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700">
            With the world’s largest web developer site.
          </p>
          <div className="flex items-center justify-center max-w-lg mx-auto mb-6">
            <input
              type="text"
              placeholder="Search our tutorials, e.g. HTML"
              className="w-full px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-r-md transition-colors"
            >
              Search
            </button>
          </div>
          <a href="#" className="text-blue-600 hover:underline inline-block mt-2">
            Not Sure Where To Begin?
          </a>
        </div>

        {/* Astronaut Image */}
        <div className="pb-32 flex justify-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Coding Mascot"
            className="w-40 h-40"
          />
        </div>

        {/* Wave Divider */}
        <svg
          viewBox="0 0 1440 320"
          className="w-full absolute bottom-0"
          preserveAspectRatio="none"
        >
          <path
            fill="#a5b4fc"
            fillOpacity="0.9"
            d="M0,256L60,240C120,224,240,192,360,160C480,128,600,96,720,112C840,128,960,192,1080,208C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Tutorial Section */}
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#a5b4fc", opacity: 0.9, border: "none" }}
      >
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="container mx-auto flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl space-y-6 p-6">
              <h1 className="text-4xl font-bold text-slate-800">Learn CSS Basics</h1>
              <p className="text-lg text-slate-700 leading-relaxed">
                CSS (Cascading Style Sheets) is used to style and layout web pages. With CSS,
                you can control:
              </p>
              <ul className="list-disc list-inside space-y-3 text-slate-700">
                <li className="text-lg">Colors and typography</li>
                <li className="text-lg">Spacing and layout</li>
                <li className="text-lg">Responsive designs</li>
                <li className="text-lg">Animations and transitions</li>
              </ul>
            </div>

            {/* Right Card */}
            <div
              className="rounded-2xl shadow-xl p-8 max-w-md w-full border border-white/50 relative overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200/30 rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-200/30 rounded-full"></div>

              <h2 className="text-3xl font-bold mb-6 text-slate-800">CSS Example</h2>

              <div className="bg-white/90 p-4 rounded-xl mb-6 border border-slate-200/80 shadow-sm">
                <pre className="font-mono text-sm text-slate-700 space-y-2">
                  <span className="text-blue-600 font-semibold">body</span> {"{\n"}
                  {"  "}
                  <span className="text-purple-600">background-color</span>:
                  <span className="text-emerald-600"> lightblue</span>;{"\n"}
                  {"}"}

                  {"\n\n"}
                  <span className="text-blue-600 font-semibold">h1</span> {"{\n"}
                  {"  "}
                  <span className="text-purple-600">color</span>:
                  <span className="text-emerald-600"> white</span>;{"\n"}
                  {"  "}
                  <span className="text-purple-600">text-align</span>:
                  <span className="text-emerald-600"> center</span>;{"\n"}
                  {"}"}

                  {"\n\n"}
                  <span className="text-blue-600 font-semibold">p</span> {"{\n"}
                  {"  "}
                  <span className="text-purple-600">font-family</span>:
                  <span className="text-emerald-600"> verdana</span>;{"\n"}
                  {"}"}
                </pre>
              </div>

              <button
                className="w-full bg-white hover:bg-blue-50/80 text-slate-700 font-medium py-3 px-6 rounded-lg 
                  transition-all border border-slate-300/50 shadow-sm hover:shadow-md hover:-translate-y-0.5
                  flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Try it Yourself
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
