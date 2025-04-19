const Hero = () => {
    return (
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-1 md:order-none">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#2E3192]">
                Master In-Demand Skills with{" "}
                <span className="text-[#00A99D]">SmecLabs</span>
              </h1>
  
              <p className="text-lg text-[#606060] mb-8 max-w-xl">
                Transform your career through our hands-on courses and expert-led
                learning paths. Start building practical skills today.
              </p>
  
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#0071BC] hover:bg-[#00A99D] text-white px-8 py-4 rounded-full text-lg transition-all duration-300 hover:-translate-y-0.5">
                  Start Learning Now
                </button>
                <button className="border-2 border-[#00A99D] text-[#00A99D] px-8 py-4 rounded-full text-lg hover:bg-[#00A99D]/10">
                  Explore Courses
                </button>
              </div>
  
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-[#00A99D]">250K+</div>
                  <div className="text-sm text-[#606060]">Learners</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-[#00A99D]">98%</div>
                  <div className="text-sm text-[#606060]">Success Rate</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-[#00A99D]">1.5K+</div>
                  <div className="text-sm text-[#606060]">Courses</div>
                </div>
              </div>
            </div>
  
            {/* Right Side - Illustration */}
            <div className="order-0 md:order-none flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 left-0 w-full h-full bg-[#00A99D]/10 rounded-2xl rotate-6"></div>
                <div className="relative space-y-6 p-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#0071BC] to-[#00A99D] rounded-2xl mx-auto flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3/4 h-3 bg-[#00A99D]/20 rounded-full">
                        <div className="w-2/3 h-full bg-[#00A99D] rounded-full"></div>
                      </div>
                      <span className="text-[#2E3192] font-medium">75%</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3/4 h-3 bg-[#0071BC]/20 rounded-full">
                        <div className="w-1/2 h-full bg-[#0071BC] rounded-full"></div>
                      </div>
                      <span className="text-[#2E3192] font-medium">50%</span>
                    </div>
                  </div>
  
                  <div className="flex justify-center space-x-4">
                    <div className="w-12 h-12 bg-[#2E3192]/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-[#2E3192]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="w-12 h-12 bg-[#00A99D]/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-[#00A99D]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="w-12 h-12 bg-[#0071BC]/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-[#0071BC]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Hero;