import React from 'react';
import { PlusCircle, Edit3, Trash2, BookOpen, Users, Star, Award, Layers, Shield } from 'lucide-react';

export default function ManageCoursesTab({
  courses,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteCourse,
  user
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Instructor & Admin CRUD Panel
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Course Management (Full CRUD)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, modify, and manage courses stored live in MongoDB (`course_enrollment_db`)
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      {/* Courses Table / List */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Database Courses ({courses.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Collection: <code className="text-indigo-300">courses</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Course Info</th>
                <th className="p-4">Category & Level</th>
                <th className="p-4">Instructor</th>
                <th className="p-4">Capacity</th>
                <th className="p-4 text-right">Actions (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {courses.map((c) => (
                <tr key={c._id} className="hover:bg-slate-900/40 transition-colors">
                  
                  {/* Title & Code */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white leading-snug">{c.title}</div>
                        <div className="text-xs font-mono text-indigo-400 mt-0.5">
                          {c.code} • {c.credits} Credits • {c.duration}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                      {c.category}
                    </span>
                    <div className="text-xs text-slate-400 mt-1">{c.level}</div>
                  </td>

                  {/* Instructor */}
                  <td className="p-4 text-slate-300 text-xs">
                    <div className="font-semibold text-slate-200">{c.instructor}</div>
                    <div className="text-slate-500">{c.schedule}</div>
                  </td>

                  {/* Enrolled */}
                  <td className="p-4">
                    <div className="text-xs font-semibold text-slate-300">
                      {c.enrolledCount} / {c.capacity} Students
                    </div>
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, (c.enrolledCount / c.capacity) * 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenEditModal(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete course "${c.title}"? This will also remove associated enrollments in MongoDB.`)) {
                            onDeleteCourse(c._id);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
