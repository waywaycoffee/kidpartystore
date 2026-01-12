/**
 * Help Center Page
 */

'use client';

import { useEffect, useState } from 'react';

interface FAQ {
  id: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
  category: string;
}

interface Policy {
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
}

type TabType = 'faq' | 'return' | 'shipping' | 'contact';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<TabType>('faq');
  const [faq, setFaq] = useState<FAQ[]>([]);
  const [policies, setPolicies] = useState<Record<string, Policy>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFAQ();
    fetchPolicies();
  }, []);

  const fetchFAQ = async () => {
    try {
      const res = await fetch('/api/help/faq');
      const data = await res.json();
      setFaq(data.faq || []);
    } catch (error) {
      console.error('Failed to fetch FAQ:', error);
    }
  };

  const fetchPolicies = async () => {
    try {
      const res = await fetch('/api/help/policies');
      const data = await res.json();
      setPolicies(data.policies || {});
    } catch (error) {
      console.error('Failed to fetch policies:', error);
    }
  };

  const filteredFAQ = faq.filter(
    (item) =>
      !searchQuery ||
      item.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answerEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Help Center</h1>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'faq'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('return')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'return'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            Return Policy
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'shipping'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            Shipping Info
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'contact'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            Contact Us
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* FAQ */}
          {activeTab === 'faq' && (
            <div>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-4">
                {filteredFAQ.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No questions found</p>
                ) : (
                  filteredFAQ.map((item) => (
                    <div key={item.id} className="border-b pb-4 last:border-0">
                      <h3 className="font-semibold text-lg mb-2">{item.questionEn}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{item.answerEn}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Return Policy */}
          {activeTab === 'return' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {policies.return?.titleEn || 'Return Policy'}
              </h2>
              <div className="text-gray-600 whitespace-pre-line">
                {policies.return?.contentEn || 'Return policy content...'}
              </div>
            </div>
          )}

          {/* Shipping Information */}
          {activeTab === 'shipping' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {policies.shipping?.titleEn || 'Shipping Information'}
              </h2>
              <div className="text-gray-600 whitespace-pre-line">
                {policies.shipping?.contentEn || 'Shipping information content...'}
              </div>
            </div>
          )}

          {/* Contact Us */}
          {activeTab === 'contact' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Service Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Monday - Friday 9:00 AM - 6:00 PM (EST)</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">support@partyexpert.com</p>
                  <p className="text-sm text-gray-500">Response within 24 hours</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-gray-600">Click the chat icon in the bottom right corner</p>
                  <p className="text-sm text-gray-500">Hours: Monday - Sunday 9:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

