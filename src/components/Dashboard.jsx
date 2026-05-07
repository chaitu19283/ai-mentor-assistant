import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { SUBJECT_LABELS, SUBJECT_COLORS } from '../data/mockData';

function CircularProgress({ value, size = 120, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const isLow = value < 75;
  const color = isLow ? '#ef4444' : '#10b981';
  const bgColor = isLow ? '#fef2f2' : '#ecfdf5';
  const glowColor = isLow ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{value}%</span>
        <span className="text-[10px] text-surface-400 font-medium">Attendance</span>
      </div>
    </div>
  );
}

function BarChart({ marks }) {
  const subjects = Object.keys(marks);
  const maxMark = 100;

  return (
    <div className="px-2">
      <div className="flex items-end gap-4" style={{ height: '160px' }}>
        {subjects.map((subj) => {
          const pct = (marks[subj] / maxMark) * 100;
          const isLow = marks[subj] < 50;
          return (
            <div key={subj} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
              <span className="text-xs font-bold text-surface-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {marks[subj]}
              </span>
              <div
                className="w-full rounded-t-xl relative overflow-hidden transition-all duration-700 ease-out"
                style={{ height: `${pct}%`, minHeight: '8px' }}
              >
                <div
                  className="absolute inset-0 rounded-t-xl"
                  style={{
                    background: `linear-gradient(to top, ${SUBJECT_COLORS[subj]}bb, ${SUBJECT_COLORS[subj]})`,
                    boxShadow: `0 -4px 16px ${SUBJECT_COLORS[subj]}30`,
                  }}
                />
                <div className="absolute inset-0 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `linear-gradient(to top, transparent, rgba(255,255,255,0.15))` }}
                />
                {isLow && (
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2">
                    <TrendingDown className="w-3.5 h-3.5 text-white/80" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Labels row */}
      <div className="flex gap-4 mt-2">
        {subjects.map((subj) => (
          <div key={subj} className="flex-1 text-center">
            <span className="text-[10px] font-medium text-surface-400 leading-tight">{SUBJECT_LABELS[subj]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ role, selectedStudent, onSelectStudent, students }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const student = students.find((s) => s.id === selectedStudent) || students[0];
  if (!student) return null;
  const avgMarks = Math.round(Object.values(student.marks).reduce((a, b) => a + b, 0) / Object.values(student.marks).length);

  return (
    <div className="space-y-5">
      {/* Student Selector */}
      <div className="relative z-20 bg-white/80 backdrop-blur rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary-600" />
            </div>
            <h2 className="text-sm font-bold text-surface-800">Academic Dashboard</h2>
          </div>
          {role === 'mentor' && (
            <div className="relative">
              <button
                id="student-selector"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-50 border border-surface-200 text-xs font-medium text-surface-600 hover:bg-surface-100 transition-colors"
              >
                {student.name}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-surface-200 py-2 z-30 flex flex-col">
                  <div className="px-3 mb-2 flex flex-col gap-2 border-b border-surface-100 pb-2">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="w-full bg-surface-50 border border-surface-200 rounded-lg px-2.5 py-1.5 text-xs text-surface-700 outline-none focus:border-primary-400"
                      onChange={(e) => document.getElementById('search-val').value = e.target.value.toLowerCase()}
                      onKeyUp={(e) => {
                        const val = e.target.value.toLowerCase();
                        document.querySelectorAll('.student-btn').forEach(btn => {
                          const name = btn.getAttribute('data-name').toLowerCase();
                          const lowAtt = btn.getAttribute('data-low') === 'true';
                          const filterLow = document.getElementById('filter-low').checked;
                          if (name.includes(val) && (!filterLow || lowAtt)) btn.style.display = 'block';
                          else btn.style.display = 'none';
                        });
                      }}
                    />
                    <label className="flex items-center gap-2 text-xs text-surface-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="filter-low" 
                        className="accent-danger-500 rounded"
                        onChange={(e) => {
                          const filterLow = e.target.checked;
                          const val = document.getElementById('search-val')?.value || '';
                          document.querySelectorAll('.student-btn').forEach(btn => {
                            const name = btn.getAttribute('data-name').toLowerCase();
                            const lowAtt = btn.getAttribute('data-low') === 'true';
                            if (name.includes(val) && (!filterLow || lowAtt)) btn.style.display = 'block';
                            else btn.style.display = 'none';
                          });
                        }}
                      />
                      Show low attendance ({"<"}75%)
                    </label>
                    <input type="hidden" id="search-val" value="" />
                  </div>
                  <div className="max-h-64 overflow-y-auto px-1">
                    {students.map((s) => (
                      <button
                        key={s.id}
                        data-name={s.name}
                        data-low={s.attendance < 75}
                        onClick={() => { onSelectStudent(s.id); setIsDropdownOpen(false); }}
                        className={`student-btn w-full text-left px-3 py-2 text-xs font-medium hover:bg-primary-50 transition-colors rounded-lg mb-0.5 ${
                          s.id === selectedStudent ? 'text-primary-600 bg-primary-50' : 'text-surface-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{s.name}</span>
                          {s.attendance < 75 && <span className="text-[10px] text-danger-500 font-bold bg-danger-50 px-1.5 py-0.5 rounded">{s.attendance}%</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Student Info Banner */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-100 mb-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-surface-800">{student.name}</p>
            <p className="text-[11px] text-surface-500">B.Tech CSE • Semester 4</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-primary-200">
            {avgMarks >= 60 ? (
              <TrendingUp className="w-3 h-3 text-accent-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-danger-400" />
            )}
            <span className={`text-xs font-bold ${avgMarks >= 60 ? 'text-accent-600' : 'text-danger-500'}`}>
              Avg: {avgMarks}%
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-5 gap-5">
        {/* Bar Chart */}
        <div className="col-span-3 bg-white/80 backdrop-blur rounded-2xl border border-surface-200/60 shadow-sm p-5">
          <h3 className="text-xs font-bold text-surface-800 mb-1">Mid-Term Marks</h3>
          <p className="text-[10px] text-surface-400 mb-4">Subject-wise performance (out of 100)</p>
          <BarChart marks={student.marks} />
        </div>

        {/* Attendance Circular */}
        <div className="col-span-2 bg-white/80 backdrop-blur rounded-2xl border border-surface-200/60 shadow-sm p-5 flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-surface-800 mb-1">Attendance Rate</h3>
          <p className="text-[10px] text-surface-400 mb-4">Current semester</p>
          <CircularProgress value={student.attendance} />
          {student.attendance < 75 && (
            <div className="mt-3 px-3 py-1.5 rounded-full bg-danger-400/10 border border-danger-400/20">
              <span className="text-[10px] font-semibold text-danger-500">⚠ Below 75% threshold</span>
            </div>
          )}
        </div>
      </div>

      {/* Daily Attendance Heatmap */}
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-surface-200/60 shadow-sm p-5">
        <h3 className="text-xs font-bold text-surface-800 mb-1">Attendance History (Last 90 Days)</h3>
        <p className="text-[10px] text-surface-400 mb-4">Daily attendance status overview</p>
        <div className="flex flex-wrap gap-1.5">
          {student.attendanceRecords?.map((record, i) => {
            let bgColor = 'bg-surface-100'; // default/absent
            if (record.status === 'present') bgColor = 'bg-emerald-500';
            if (record.status === 'late') bgColor = 'bg-amber-400';
            if (record.status === 'absent') bgColor = 'bg-danger-400';

            return (
              <div 
                key={i} 
                className={`w-3.5 h-3.5 rounded-[3px] ${bgColor} transition-transform hover:scale-125 cursor-help group relative`}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className="bg-surface-800 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString()} - <span className="capitalize">{record.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-[10px] font-medium text-surface-500 justify-end">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500"></span> Present</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[2px] bg-amber-400"></span> Late</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[2px] bg-danger-400"></span> Absent</div>
        </div>
      </div>
    </div>
  );
}
