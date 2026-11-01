import React, { useState } from 'react';
import { Search, Filter, Star, Clock, User, Award, CheckCircle, PlusCircle, Sparkles } from 'lucide-react';

export default function CatalogTab({
  courses,
  userEnrollments,
  user,
  onSelectCourse,
  onEnroll,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel
}) {
  const categories = [
    'All',
    'Web Development',
    'Computer Science',
    'Data Science & AI',
    'Cloud & DevOps',
    'Cybersecurity',
    'UI/UX Design'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const isEnrolled = (courseId) => {
    return userEnrollments.some(e => e.course?._id === courseId || e.course === courseId);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Search & Filter Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              Explore Course Catalog ({courses.length} Courses Available)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse world-class engineering & technology courses backed by MongoDB database records
            </p>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, code, or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-4 text-xs pt-1 border-t border-slate-800/80">
          <span className="font-semibold text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            Difficulty Level:
          </span>
          <div className="flex items-center gap-2">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedLevel === lvl
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((c) => {
            const enrolled = isEnrolled(c._id);
            return (
              <div
                key={c._id}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onSelectCourse(c)}>
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-indigo-300 border border-slate-700/80">
                    {c.category}
                  </span>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-amber-300 border border-slate-700/80 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {c.rating}
                  </div>

                  {/* Code & Level */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-white bg-indigo-600/90 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-slate-300 font-medium px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700">
                      {c.level}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      onClick={() => onSelectCourse(c)}
                      className="font-bold text-lg text-white group-hover:text-indigo-300 cursor-pointer transition-colors line-clamp-2 leading-snug"
                    >
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="truncate">{c.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{c.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{c.credits} Credits</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{c.enrolledCount}/{c.capacity} Enrolled</span>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onSelectCourse(c)}
                      className="text-xs text-slate-400 hover:text-white font-medium underline"
                    >
                      View Syllabus & Details
                    </button>

                    {enrolled ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        <CheckCircle className="w-4 h-4" />
                        Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (!user) {
                            onOpenAuth('login');
                          } else {
                            onEnroll(c._id);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Enroll Now
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 glass-panel rounded-3xl border border-slate-800">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No courses match your filter criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords or switching category/level filters.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
