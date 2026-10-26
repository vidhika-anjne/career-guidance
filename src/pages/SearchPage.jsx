import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building2, X, Loader2, ExternalLink, Mail, Phone, Filter, ChevronDown, Award } from 'lucide-react';

const SearchPage = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedOwnership, setSelectedOwnership] = useState('');
  const [minRank, setMinRank] = useState('');
  const [maxRank, setMaxRank] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [cities, setCities] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  const types = [
    { value: 'technology', label: 'Engineering & Tech', color: 'from-blue-500 to-cyan-500' },
    { value: 'medical', label: 'Medical', color: 'from-red-500 to-pink-500' },
    { value: 'commerce', label: 'Commerce & Management', color: 'from-green-500 to-emerald-500' },
    { value: 'arts', label: 'Arts & Humanities', color: 'from-purple-500 to-violet-500' },
    { value: 'design', label: 'Design & Architecture', color: 'from-orange-500 to-amber-500' },
    { value: 'science', label: 'Science', color: 'from-teal-500 to-cyan-500' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'rank_asc', label: 'Best Ranked' },
    { value: 'city_asc', label: 'City (A-Z)' }
  ];

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/colleges/cities`);
        const data = await response.json();
        setCities(data.items || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('name', searchTerm);
      if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
      if (selectedState) params.set('state', selectedState);
      if (selectedCity) params.set('city', selectedCity);
      if (selectedOwnership) params.set('ownership', selectedOwnership);
      if (minRank) params.set('min_rank', minRank);
      if (maxRank) params.set('max_rank', maxRank);
      params.set('limit', '200');

      const response = await fetch(`${API_BASE}/api/colleges?${params.toString()}`);
      const data = await response.json();
      setColleges(data.items || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side sorting
  useEffect(() => {
    let sorted = [...colleges];
    switch (sortBy) {
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rank_asc':
        sorted.sort((a, b) => {
          if (!a.rank_position) return 1;
          if (!b.rank_position) return -1;
          return a.rank_position - b.rank_position;
        });
        break;
      case 'city_asc':
        sorted.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
        break;
      default:
        // relevance - keep as is (sorted by total_score from backend)
        break;
    }
    setFilteredColleges(sorted);
  }, [colleges, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColleges();
    }, 150);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedTypes, selectedState, selectedCity, selectedOwnership, minRank, maxRank]);

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTypes([]);
    setSelectedState('');
    setSelectedCity('');
    setSelectedOwnership('');
    setMinRank('');
    setMaxRank('');
    setSortBy('relevance');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedTypes.length > 0) count++;
    if (selectedState) count++;
    if (selectedCity) count++;
    if (selectedOwnership) count++;
    if (minRank || maxRank) count++;
    return count;
  };

  const removeFilter = (filterType) => {
    switch (filterType) {
      case 'search': setSearchTerm(''); break;
      case 'types': setSelectedTypes([]); break;
      case 'state': setSelectedState(''); break;
      case 'city': setSelectedCity(''); break;
      case 'ownership': setSelectedOwnership(''); break;
      case 'ranking': setMinRank(''); setMaxRank(''); break;
      default: break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Find Your Dream College
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 text-lg"
          >
            Search from over 900+ colleges across India
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6 mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search colleges by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              <Filter size={20} />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              <ChevronDown size={20} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            {getActiveFilterCount() > 0 && (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {getActiveFilterCount()} Active Filter{getActiveFilterCount() > 1 ? 's' : ''}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <X size={16} />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Filters Section */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Field Filter */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Filter by Field</h3>
                  <div className="flex flex-wrap gap-3">
                    {types.map((type) => (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleType(type.value)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedTypes.includes(type.value)
                          ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* City and Ownership Filters */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {/* City Filter */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-3">Filter by City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                    >
                      <option value="">All Cities</option>
                      {cities.map((cityObj) => (
                        <option key={`${cityObj.city}-${cityObj.state}`} value={cityObj.city}>
                          {cityObj.city.charAt(0).toUpperCase() + cityObj.city.slice(1)}, {cityObj.state.toUpperCase()} ({cityObj.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ownership Filter */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-3">Ownership Type</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedOwnership(selectedOwnership === 'government' ? '' : 'government')}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all border-2 ${selectedOwnership === 'government'
                          ? 'bg-green-500 text-white border-green-500 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                          }`}
                      >
                        🏛️ Government
                      </button>
                      <button
                        onClick={() => setSelectedOwnership(selectedOwnership === 'private' ? '' : 'private')}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all border-2 ${selectedOwnership === 'private'
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                          }`}
                      >
                        🏢 Private
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ranking Filter */}
                <div className="mt-6">
                  <label className="block font-semibold text-gray-700 mb-3">NIRF Ranking Range</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Minimum Rank</label>
                      <input
                        type="number"
                        placeholder="e.g., 1"
                        value={minRank}
                        onChange={(e) => setMinRank(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Maximum Rank</label>
                      <input
                        type="number"
                        placeholder="e.g., 100"
                        value={maxRank}
                        onChange={(e) => setMaxRank(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        min="1"
                      />
                    </div>
                  </div>
                  {(minRank || maxRank) && (
                    <p className="text-sm text-gray-600 mt-2">
                      Showing colleges ranked {minRank || '1'} to {maxRank || '∞'}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Active Filter Chips */}
        {getActiveFilterCount() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {searchTerm && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <span>Search: "{searchTerm}"</span>
                <button onClick={() => removeFilter('search')} className="hover:bg-blue-200 rounded-full p-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {selectedTypes.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                <span>{selectedTypes.length} Field{selectedTypes.length > 1 ? 's' : ''}</span>
                <button onClick={() => removeFilter('types')} className="hover:bg-purple-200 rounded-full p-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {selectedCity && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span>City: {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</span>
                <button onClick={() => removeFilter('city')} className="hover:bg-green-200 rounded-full p-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {selectedOwnership && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                <span>{selectedOwnership === 'government' ? '🏛️ Government' : '🏢 Private'}</span>
                <button onClick={() => removeFilter('ownership')} className="hover:bg-orange-200 rounded-full p-1">
                  <X size={14} />
                </button>
              </div>
            )}
            {(minRank || maxRank) && (
              <div className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                <span>Rank: {minRank || '1'} - {maxRank || '∞'}</span>
                <button onClick={() => removeFilter('ranking')} className="hover:bg-pink-200 rounded-full p-1">
                  <X size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={24} />
                  Searching...
                </span>
              ) : (
                <span>{filteredColleges.length} College{filteredColleges.length !== 1 ? 's' : ''} Found</span>
              )}
            </h2>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-medium">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white font-medium"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* College Cards */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🏫</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Colleges Found</h3>
                <p className="text-gray-500">Try adjusting your search filters</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredColleges.map((college, index) => (
                  <motion.div
                    key={college.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    onClick={() => setSelectedCollege(college)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                          {college.name}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${college.ownership === 'government'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {college.ownership === 'government' ? 'Govt' : 'Private'}
                        </span>
                        {college.rank_position && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <Award size={12} />
                            #{college.rank_position}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={16} className="mr-2 text-blue-500" />
                        <span>{college.city}, {college.state}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Building2 size={16} className="mr-2 text-purple-500" />
                        <span className="capitalize">{college.type}</span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-shadow">
                      View Details
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* College Details Modal */}
      <AnimatePresence>
        {selectedCollege && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCollege(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedCollege.name}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedCollege.ownership === 'government'
                        ? 'bg-green-400 bg-opacity-30 text-white'
                        : 'bg-blue-400 bg-opacity-30 text-white'
                        }`}>
                        {selectedCollege.ownership === 'government' ? 'Government' : 'Private'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-20 text-white capitalize">
                        {selectedCollege.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCollege(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Location */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</h3>
                  <div className="flex items-center text-gray-700">
                    <MapPin size={20} className="mr-3 text-blue-500" />
                    <span className="text-lg">{selectedCollege.city}, {selectedCollege.state}</span>
                  </div>
                </div>

                {/* Institute ID */}
                {selectedCollege.institute_id && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Institute ID</h3>
                    <div className="flex items-center text-gray-700">
                      <span className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">{selectedCollege.institute_id}</span>
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedCollege.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">About</h3>
                    <p className="text-gray-700">{selectedCollege.description}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    {selectedCollege.website && (
                      <a
                        href={selectedCollege.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink size={18} className="mr-2" />
                        <span>Visit Website</span>
                      </a>
                    )}
                    {selectedCollege.email && (
                      <div className="flex items-center text-gray-700">
                        <Mail size={18} className="mr-2 text-gray-500" />
                        <span>{selectedCollege.email}</span>
                      </div>
                    )}
                    {selectedCollege.phone && (
                      <div className="flex items-center text-gray-700">
                        <Phone size={18} className="mr-2 text-gray-500" />
                        <span>{selectedCollege.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* NIRF Metrics */}
                {(selectedCollege.total_score || selectedCollege.tlr) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">NIRF Ranking & Metrics</h3>

                    {/* Score and Rank - Highlighted */}
                    {(selectedCollege.total_score || selectedCollege.rank_position) && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          {selectedCollege.total_score && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Total Score</p>
                              <p className="text-3xl font-bold text-blue-600">{selectedCollege.total_score}</p>
                            </div>
                          )}
                          {selectedCollege.rank_position && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">NIRF Rank</p>
                              <p className="text-3xl font-bold text-indigo-600">#{selectedCollege.rank_position}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Detailed Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedCollege.tlr && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Teaching, Learning & Resources</p>
                          <p className="text-2xl font-bold text-gray-800">{selectedCollege.tlr}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${selectedCollege.tlr}%` }}></div>
                          </div>
                        </div>
                      )}
                      {selectedCollege.rpc && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Research & Professional Practice</p>
                          <p className="text-2xl font-bold text-gray-800">{selectedCollege.rpc}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${selectedCollege.rpc}%` }}></div>
                          </div>
                        </div>
                      )}
                      {selectedCollege.go_score && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Graduation Outcomes</p>
                          <p className="text-2xl font-bold text-gray-800">{selectedCollege.go_score}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${selectedCollege.go_score}%` }}></div>
                          </div>
                        </div>
                      )}
                      {selectedCollege.oi && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Outreach & Inclusivity</p>
                          <p className="text-2xl font-bold text-gray-800">{selectedCollege.oi}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">

                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${selectedCollege.oi}%` }}></div>
                          </div>
                        </div>
                      )}
                      {selectedCollege.perception && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3 col-span-2">
                          <p className="text-xs text-gray-500 mb-1">Perception</p>
                          <p className="text-2xl font-bold text-gray-800">{selectedCollege.perception}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${selectedCollege.perception}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-gray-50 rounded-b-2xl">
                {selectedCollege.website ? (
                  <a
                    href={selectedCollege.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                  >
                    Visit College Website
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedCollege(null)}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchPage;
