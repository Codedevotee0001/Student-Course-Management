import React from 'react';
import { BookOpen, CheckCircle, Award, Clock, ArrowRight, PlayCircle, Calendar, Sparkles, TrendingUp } from 'lucide-react';

export default function OverviewTab({ user, enrollments, courses, onNavigateTab, onSelectCourse }) {
  const activeEnrollments = enrollments.filter(e => e.status === 'Active');
  const completedEnrollments = enrollments.filter(e => e.status === 'Completed');
  
  const totalCredits = enrollments.reduce((sum, e) => sum + (e.course?.credits || 0), 0);
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-950/60 border border-indigo-500/20 p-6 sm:p-8">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Fall Semester 2026 Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {user ? user.name : 'Learner'}! 👋
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {user
              ? `You are currently enrolled in ${enrollments.length} course${enrollments.length === 1 ? '' : 's'}. You're making great progress toward your ${user.department} goals!`
              : 'Browse available courses, enroll in top engineering programs, and track your learning progress.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('catalog')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              Explore Catalog
              <ArrowRight className="w-4 h-4" />
            </button>
            {user && (
              <button
                onClick={() => onNavigateTab('my-courses')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
              >
                View My Enrolled Courses ({enrollments.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enrolled Courses</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{enrollments.length}</div>
          <div className="text-xs text-indigo-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {activeEnrollments.length} Active learning
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{completedEnrollments.length}</div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">Courses finished</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Credits</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{totalCredits}</div>
          <div className="text-xs text-amber-400 mt-1 font-medium">Earned credit units</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Progress</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3">{avgProgress}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${avgProgress}%` }} />
          </div>
        </div>

      </div>

      {/* Main Grid: Continue Learning + Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Continue Learning Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-indigo-400" />
              Continue Learning
            </h2>
            <button
              onClick={() => onNavigateTab('my-courses')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View All Enrolled →
            </button>
          </div>

          {activeEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeEnrollments.map((e) => {
                const c = e.course;
                if (!c) return null;
                return (
                  <div
                    key={e._id}
                    onClick={() => onSelectCourse(c)}
                    className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer group transition-all"
                  >
                    <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 text-[10px] font-bold text-indigo-300 border border-slate-700">
                        {c.code}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{c.instructor}</p>

                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-indigo-400">{e.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${e.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-slate-300">No active course enrollments yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Explore our engineering catalog and enroll in top courses to jumpstart your career.
              </p>
              <button
                onClick={() => onNavigateTab('catalog')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
              >
                Browse Course Catalog
              </button>
            </div>
          )}
        </div>

        {/* Weekly Schedule & Quick Info (1 col) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Class Schedule
          </h2>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            {enrollments.length > 0 ? (
              enrollments.map((e) => (
                <div key={e._id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{e.course?.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{e.course?.schedule}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-400">
                      {e.course?.code} • {e.course?.duration}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">
                Enroll in courses to populate your weekly schedule.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
