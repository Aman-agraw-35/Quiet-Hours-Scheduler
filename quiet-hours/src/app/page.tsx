import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 tracking-tight">
              Quiet Hours
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Schedule your study blocks and get email reminders to stay focused and productive
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Schedule Blocks</h3>
                <p className="text-gray-600">Set up your study sessions with start and end times</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Reminders</h3>
                <p className="text-gray-600">Get notified 10 minutes before your study block starts</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Stay Focused</h3>
                <p className="text-gray-600">Never miss a study session with automated notifications</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200 shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}