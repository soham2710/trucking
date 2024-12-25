// components/Newsletter.tsx
'use client';
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <Mail className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Industry News</h2>
          <p className="text-lg mb-8">
            Subscribe to our newsletter for the latest shipping rates, industry insights, 
            and logistics news delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-3 rounded font-semibold hover:bg-gray-100 
                       transition duration-300 disabled:opacity-70"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && (
            <p className="mt-4 text-green-200">Thank you for subscribing!</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-200">An error occurred. Please try again.</p>
          )}
          <p className="mt-6 text-sm text-blue-200">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;