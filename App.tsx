import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, MapPin, Briefcase, BarChart3, Info, Filter } from 'lucide-react';
import { Occupation, DataPoint } from './types';
import { TrendChart } from './components/TrendChart';
import { VolumeChart } from './components/VolumeChart';
import { AICard } from './components/AICard';
import { ALL_OCCUPATIONS } from './data/occupations';

// --- COMPONENTS ---

const StatCard = ({ title, value, subtitle, color }: { title: string, value: string, subtitle: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <h4 className="text-slate-500 text-sm font-medium mb-2">{title}</h4>
    <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
    <p className="text-slate-400 text-xs">{subtitle}</p>
  </div>
);

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />; // Up in score is "Bad" for difficulty, usually means harder
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
};

const App: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(ALL_OCCUPATIONS.map(o => o.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const filteredOccupations = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return ALL_OCCUPATIONS.filter(occ => {
      const matchesSearch = occ.title.toLowerCase().includes(q) || 
                            occ.code.includes(q);
      const matchesCategory = selectedCategory === 'All' || occ.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const activeOccupation = useMemo(() => 
    ALL_OCCUPATIONS.find(o => o.code === selectedCode), 
  [selectedCode]);

  const handleSelect = (code: string) => {
    setSelectedCode(code);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate global stats
  const averageScore = useMemo(() => {
      const sum = ALL_OCCUPATIONS.reduce((acc, curr) => acc + curr.data[curr.data.length-1].score189, 0);
      return Math.round(sum / ALL_OCCUPATIONS.length);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedCode(null)}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MapPin className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">AusVisa<span className="text-indigo-600">Track</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Dashboard</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">State Data</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Resources</a>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors text-xs">
              Subscribe
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero / Search */}
        <div className="mb-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Check Your Immigration Score Trends
            </h2>
            <p className="text-slate-500 text-lg mb-6">
              Track historical invitation points, backlog volume, and invitation rounds for {ALL_OCCUPATIONS.length} skilled occupations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
                  placeholder="Search by Occupation Name or Code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative min-w-[140px]">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-slate-400" />
                </div>
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full pl-10 pr-8 py-4 border border-slate-200 rounded-xl leading-5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm appearance-none cursor-pointer"
                >
                    {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {activeOccupation ? (
          // Detail View
          <div className="space-y-6 animate-fade-in">
            <button 
              onClick={() => setSelectedCode(null)}
              className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-2"
            >
              ← Back to Overview
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Col: Main Info & Chart */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-slate-100 text-slate-600 text-xs font-mono px-2 py-1 rounded">{activeOccupation.code}</span>
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">{activeOccupation.category}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">{activeOccupation.title}</h2>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-500">Current 189 Cutoff</div>
                        <div className="text-3xl font-bold text-indigo-600">
                            {activeOccupation.data[activeOccupation.data.length-1].score189}
                        </div>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{activeOccupation.description}</p>
                </div>

                <TrendChart data={activeOccupation.data} />
                
                <VolumeChart data={activeOccupation.data} />
              </div>

              {/* Right Col: Stats & AI */}
              <div className="space-y-6">
                <AICard occupation={activeOccupation} />
                
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-slate-500"/>
                        Quick Stats (Current)
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-slate-600">190 Score</span>
                            <span className="font-bold text-slate-900">
                                {activeOccupation.data[activeOccupation.data.length-1].score190}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-slate-600">Backlog Volume</span>
                            <span className="font-bold text-slate-900">
                                {activeOccupation.data[activeOccupation.data.length-1].applications}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-slate-600">Trend (YoY)</span>
                            <div className="flex items-center gap-1 font-medium">
                                {activeOccupation.trend.toUpperCase()}
                                <TrendIcon trend={activeOccupation.trend} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-600 p-5 rounded-xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Need more points?</h3>
                        <p className="text-blue-100 text-sm mb-4">Discover how a Professional Year or NAATI CCL can add 5 extra points to your profile.</p>
                        <button className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                            Learn Strategies
                        </button>
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-blue-500 opacity-50">
                        <Briefcase className="w-24 h-24" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Dashboard List View
          <>
            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard title="Next Invitation Round" value="In 14 Days" subtitle="Estimated Date: 15th Oct" color="text-slate-800"/>
                <StatCard title="Total Occupations Tracked" value={String(ALL_OCCUPATIONS.length)} subtitle="Across all categories" color="text-indigo-600"/>
                <StatCard title="Average Cutoff (189)" value={String(averageScore)} subtitle="Across all sectors" color="text-emerald-600"/>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span>All Occupations</span>
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    Showing {filteredOccupations.length} results
                </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOccupations.length > 0 ? (
                filteredOccupations.map((occ) => (
                  <div 
                    key={occ.code} 
                    onClick={() => handleSelect(occ.code)}
                    className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-slate-100 text-slate-600 text-xs font-mono px-2 py-1 rounded group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {occ.code}
                      </div>
                      <TrendIcon trend={occ.trend} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">{occ.title}</h4>
                    <div className="flex items-center gap-2 mb-4">
                         <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{occ.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="text-xs text-slate-500">Latest 189 Score</div>
                      <div className="font-bold text-slate-900">{occ.data[occ.data.length-1].score189}</div>
                    </div>
                     <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-slate-500">Backlog</div>
                      <div className="font-medium text-xs text-slate-600">{occ.data[occ.data.length-1].applications}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                     <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-slate-900 font-medium">No occupations found</h3>
                  <p className="text-slate-500 text-sm">Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;