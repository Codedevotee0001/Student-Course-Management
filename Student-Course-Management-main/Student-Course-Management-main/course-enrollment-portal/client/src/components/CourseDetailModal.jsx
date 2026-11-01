import React from 'react';
import { X, Star, Clock, User, Award, CheckCircle, PlusCircle, Calendar, BookOpen, Layers } from 'lucide-react';

export default function CourseDetailModal({ course, isOpen, onClose, isEnrolled, onEnroll, user, onOpenAuth }) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Banner Image */}
        <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-950 rounded-full backdrop-blur-md transition-all border border-slate-700/60"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-indigo-300 border border-slate-700">
            {course.category}
          </span>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="font-mono text-xs font-bold bg-indigo-600 px-2 py-0.5 rounded text-white mb-1 inline-block">
                {course.code}
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">{course.title}</h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Instructor</span>
              <span className="text-xs font-bold text-white mt-1 block truncate">{course.instructor}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
              <span className="text-xs font-bold text-indigo-300 mt-1 block">{course.duration}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Credits</span>
              <span className="text-xs font-bold text-amber-300 mt-1 block">{course.credits} Units</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Capacity</span>
              <span className="text-xs font-bold text-emerald-300 mt-1 block">{course.enrolledCount}/{course.capacity}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">About This Course</h4>
            <p className="text-sm leading-relaxed text-slate-300">{course.description}</p>
          </div>

          {/* Schedule */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">Weekly Class Schedule</span>
              <span className="text-xs text-slate-400">{course.schedule}</span>
            </div>
          </div>

          {/* Syllabus Breakdown */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Course Syllabus Modules
              </h4>
              <div className="space-y-2.5">
                {course.syllabus.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      W{item.week || idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{item.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.topics}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Action */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Rating: <span className="text-amber-300 font-bold">★ {course.rating}</span> • Level: <span className="text-slate-200 font-semibold">{course.level}</span>
          </div>

          {isEnrolled ? (
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              You Are Enrolled
            </span>
          ) : (
            <button
              onClick={() => {
                if (!user) {
                  onClose();
                  onOpenAuth('login');
                } else {
                  onEnroll(course._id);
                  onClose();
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Confirm Course Enrollment
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
