import React from 'react';

const Navbar = () => (
  <nav className="bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg">
    <div className="container mx-auto px-6 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/logo.png" alt="UMAX Logo" className="h-8 w-8 mr-2" />
        <span className="font-semibold text-xl text-white">UMAX Dashboard</span>
      </div>
      <div>
        <a href="#" className="text-white hover:text-gray-200 px-3 py-2">Home</a>
        <a href="#" className="text-white hover:text-gray-200 px-3 py-2">Features</a>
        <a href="#" className="text-white hover:text-gray-200 px-3 py-2">Pricing</a>
        <a href="#" className="text-white hover:text-gray-200 px-3 py-2">Contact</a>
      </div>
    </div>
  </nav>
);

const StatisticsCard = ({ title, value }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/4 m-2 transform transition-transform hover:scale-105">
    <h3 className="text-xl font-semibold mb-2 text-gray-700">{title}</h3>
    <p className="text-2xl font-bold text-indigo-600">{value}</p>
  </div>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-6 mt-12">
    <div className="container mx-auto px-6 text-center">
      <p>&copy; 2024 UMAX Dashboard. All rights reserved.</p>
      <p>1234 Street Name, City, State, 12345</p>
      <p>Email: info@umaxdashboard.com | Phone: (123) 456-7890</p>
    </div>
  </footer>
);

const Page = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center mb-8 transform transition-transform hover:scale-105">
          <h1 className="text-4xl font-bold mb-4 text-indigo-700">Welcome to UMAX Dashboard</h1>
          <p className="text-lg mb-8 text-gray-700">This is a landing page for UMAX Dashboard</p>
          <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </a>
        </div>
        <div className="flex flex-wrap justify-center w-full px-6">
          <StatisticsCard title="Total Users" value="1,234" />
          <StatisticsCard title="Active Sessions" value="567" />
          <StatisticsCard title="Revenue" value="$12,345" />
          <StatisticsCard title="New Signups" value="78" />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8 w-3/4 text-center transform transition-transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">Our Services</h2>
          <p className="text-lg mb-4 text-gray-700">
            UMAX Dashboard provides comprehensive analytics and insights for your business. Our services include real-time data tracking, detailed reports, and user-friendly interfaces to help you make informed decisions.
          </p>
          <p className="text-lg text-gray-700">
            With UMAX Dashboard, you can monitor your business performance, identify trends, and optimize your operations for maximum efficiency and growth.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Page;
