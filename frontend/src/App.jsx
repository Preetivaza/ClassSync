// src/App.jsx
import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Basic validation
    if (email && email.includes('@')) {
      // Simulate subscription logic (e.g., API call)
      console.log(`Subscribed with email: ${email}`);
      setIsSubscribed(true);
      setEmail(''); // Clear the input field
      // Reset success message after a few seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Header / Navigation */}
      <header className="w-full max-w-6xl py-6 flex justify-between items-center">
        <div className="text-3xl font-bold text-indigo-700">ClassSync</div>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a></li>
            <li><a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium">How It Works</a></li>
            <li><a href="#testimonials" className="text-gray-700 hover:text-indigo-600 font-medium">Testimonials</a></li>
          </ul>
        </nav>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center max-w-3xl mt-10 mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Effortless Class Management & Synchronization
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl">
          Streamline your teaching and learning experience. Sync schedules, share resources, and engage with your class, all in one place.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            Get Started for Free
          </button>
          <button className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-300 text-lg font-bold py-3 px-8 rounded-lg shadow transition duration-300 ease-in-out">
            Watch Demo
          </button>
        </div>
      </main>

      {/* Features Preview Section */}
      <section id="features" className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Powerful Features for Educators & Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-indigo-600 text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Scheduling</h3>
            <p className="text-gray-600">Keep everyone on the same page with live-updating calendars and class schedules.</p>
          </div>
          <div className="p-6">
            <div className="text-indigo-600 text-5xl mb-4">🔗</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Resource Hub</h3>
            <p className="text-gray-600">Easily share documents, links, and assignments in a centralized, organized space.</p>
          </div>
          <div className="p-6">
            <div className="text-indigo-600 text-5xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Communication</h3>
            <p className="text-gray-600">Facilitate discussions and Q&A with integrated messaging and announcements.</p>
          </div>
        </div>
      </section>

      {/* Call to Action / Newsletter Signup */}
      <section className="w-full max-w-3xl bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-10 text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-indigo-100 mb-6">
          Subscribe to our newsletter for the latest features, tips, and educational resources.
        </p>
        {isSubscribed ? (
          <div className="bg-green-100 text-green-800 py-3 px-4 rounded-lg inline-block">
            Thank you for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="px-5 py-3 rounded-lg flex-grow max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
            <button
              type="submit"
              className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg whitespace-nowrap transition duration-300 ease-in-out"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl py-8 text-center text-gray-600 text-sm border-t border-gray-200">
        <p>© {new Date().getFullYear()} ClassSync. All rights reserved.</p>
        <div className="mt-2 space-x-6">
          <a href="/terms" className="hover:text-indigo-600">Terms of Service</a>
          <a href="/privacy" className="hover:text-indigo-600">Privacy Policy</a>
          <a href="/contact" className="hover:text-indigo-600">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default App;