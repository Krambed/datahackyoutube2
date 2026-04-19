'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:8000';

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Dashboard() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [topTags, setTopTags] = useState<Record<string, number>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('darkMode');
    const isDark = saved ? JSON.parse(saved) : false;
    setDarkMode(isDark);

    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      router.push('/');
    }

    // Fetch countries
    axios.get(`${API_BASE}/countries`).then(res => setCountries(res.data.countries));
  }, [router]);

  useEffect(() => {
    if (selectedCountry) {
      axios.get(`${API_BASE}/top_tags/${selectedCountry}`).then(res => setTopTags(res.data));
      axios.get(`${API_BASE}/trends/${selectedCountry}`).then(res => setTrends(res.data));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedTags.length > 0) {
      const tagsStr = selectedTags.join(',');
      axios.get(`${API_BASE}/recommendations/${selectedCountry}?tags=${tagsStr}`).then(res => setRecommendations(res.data));
    } else {
      setRecommendations([]);
    }
  }, [selectedCountry, selectedTags]);

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    const html = document.documentElement;
    if (newDarkMode) {
      html.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
    } else {
      html.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    router.push('/');
  };

  const tagData = Object.entries(topTags)
    .map(([tag, count]) => ({ name: tag || 'Untagged', value: count }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views;
  };

  if (!mounted) return null;

  const countryLabel = countries.find(c => c === selectedCountry) || selectedCountry;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-white via-gray-50 to-white text-gray-900'
    }`}>
      {/* Header */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold font-poppins bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              YouTube Trend Advisor
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              This week's trending data from {countryLabel}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-lg transition transform hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Country Selector */}
        <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <label className="block text-sm font-semibold mb-2">Select Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={`w-full md:w-48 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } border`}
          >
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Tags */}
          {tagData.length > 0 && (
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className="text-2xl font-bold font-poppins mb-4">🏷️ Top Tags</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tagData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tagData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top 10 Trending Videos */}
          {trends.length > 0 && (
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className="text-2xl font-bold font-poppins mb-4">📈 Top 10 Trending Videos</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trends.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="title" width={100} tick={{ fontSize: 12 }} stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}` }} />
                  <Bar dataKey="view_count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Personalization Section */}
        <div className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-2xl font-bold font-poppins mb-4">🎯 Personalize Your Feed</h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select your favorite tags to get personalized video recommendations
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(topTags).map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`px-4 py-2 rounded-full font-semibold transition transform hover:scale-105 ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {tag} <span className="ml-1 text-sm opacity-75">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-poppins mb-6">✨ Recommendations for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {recommendations.slice(0, 6).map((rec, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg overflow-hidden transition transform hover:scale-105 ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  {/* YouTube Embed */}
                  <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={getYouTubeEmbedUrl(rec.video_id)}
                      title={rec.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 'none' }}
                    />
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-bold font-poppins text-lg mb-2 line-clamp-2">{rec.title}</h3>
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {rec.channel_title}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Views</p>
                        <p className="font-bold">{formatViews(rec.view_count)}</p>
                      </div>
                      <div>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Likes</p>
                        <p className="font-bold">{formatViews(rec.likes)}</p>
                      </div>
                    </div>
                    {rec.tags && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {rec.tags.split(',').slice(0, 3).map((tag: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
