import { Github, Bug } from 'lucide-react';

const BugReport = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Bug className="h-16 w-16 mx-auto mb-4 text-white/90" />
          <h1 className="text-4xl font-bold mb-3">Report a Bug</h1>
          <p className="text-xl opacity-90">Help us improve by reporting any issues you encounter</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Submit Bug Reports on GitHub</h2>
            <p className="text-gray-600 mb-6">
              We use GitHub Issues to track bugs and feature requests. Please visit our repository to report any issues you've found.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <a
              href="https://github.com/ForkMeMaybe/Shop-Sphere-Frontend/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#24292F] text-white px-8 py-4 rounded-lg hover:bg-[#1b1f23] transition-colors"
            >
              <Github className="w-6 h-6" />
              <span className="font-semibold text-center">Create Issue on GitHub (Frontend)</span>
            </a>
            <a
              href="https://github.com/ForkMeMaybe/Shop-Sphere/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#24292F] text-white px-8 py-4 rounded-lg hover:bg-[#1b1f23] transition-colors"
            >
              <Github className="w-6 h-6" />
              <span className="font-semibold text-center">Create Issue on GitHub (Backend)</span>
            </a>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Before Submitting a Bug Report</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Check if the issue has already been reported by searching the GitHub Issues.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Include a clear description of the bug and steps to reproduce it.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Add screenshots if they help explain the problem.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">4.</span>
                <span>Mention your browser and operating system versions.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugReport;
