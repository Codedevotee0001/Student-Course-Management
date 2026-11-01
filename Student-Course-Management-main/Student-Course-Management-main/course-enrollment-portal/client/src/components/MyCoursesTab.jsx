import React from 'react';
import { GraduationCap, CheckCircle2, Clock, Trash2, Calendar, BookOpen, Sparkles, Zap, Trophy, Plus, Check } from 'lucide-react';

export default function MyCoursesTab({ enrollments, onUpdateProgress, onUnenroll, onSelectCourse, onNavigateTab }) {
  const milestones = [0, 25, 50, 75, 100];

  const handleAdvance = (enrollment) => {
    const nextVal = Math.min(100, enrollment.progress + 25);
    onUpdateProgress(enrollment._id, nextVal);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-400" />
            My Enrolled Courses & Progress Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Click milestone buttons or use quick advance to update your progress in MongoDB
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('catalog')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
        >
          + Enroll in More Courses
        </button>
      </div>

      {/* Enrolled Courses Grid */}
      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.map((e) => {
            const c = e.course;
            if (!c) return null;

            const isCompleted = e.progress === 100;

            return (
              <div
                key={e._id}
                className={`glass-card rounded-3xl border overflow-hidden flex flex-col justify-between p-6 space-y-5 transition-all duration-300 ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                
                {/* Course Top Info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-700">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                        {c.code} • {c.credits} Credits
                      </span>
                      
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        {isCompleted ? '🎉 Completed (Grade: A)' : `${e.progress}% In Progress`}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectCourse(c)}
                      className="font-extrabold text-lg text-white hover:text-indigo-300 cursor-pointer transition-colors mt-1.5 truncate"
                    >
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{c.instructor} • {c.category}</p>
                  </div>
                </div>

                {/* Progress Bar Display */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      Course Completion Milestone
                    </span>
                    <span className="font-mono font-extrabold text-indigo-400 text-sm">{e.progress}%</span>
                  </div>

                  {/* Gradient Progress Bar */}
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 shadow-lg ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 shadow-emerald-500/30'
                          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-indigo-500/30'
                      }`}
                      style={{ width: `${e.progress}%` }}
                    />
                  </div>
                </div>

                {/* 1-Click Milestone Quick Update Buttons */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Quick Update Milestone:</span>
                    {!isCompleted && (
                      <button
                        onClick={() => handleAdvance(e)}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold normal-case"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        + Advance 25%
                      </button>
                    )}
                  </div>

                  {/* Milestone Pills */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {milestones.map((m) => {
                      const isCurrent = e.progress === m;
                      return (
                        <button
                          key={m}
                          onClick={() => onUpdateProgress(e._id, m)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                            isCurrent
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/50 scale-105'
                              : e.progress > m
                              ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span>{m}%</span>
                          {isCurrent && <Check className="w-3 h-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.schedule}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectCourse(c)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      Syllabus →
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to unenroll from "${c.title}"?`)) {
                          onUnenroll(e._id);
                        }
                      }}
                      title="Unenroll / Drop Course"
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-300">No active course enrollments</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto mb-6">
            You are not currently enrolled in any courses. Browse the course catalog and start learning today!
          </p>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            Explore Catalog
          </button>
        </div>
      )}

    </div>
  );
}
