import { GraduationCap, Eye, Sparkles } from 'lucide-react';

export default function Header({ role, onToggleRole }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-surface-200/60 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-500 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-surface-900 tracking-tight">MentorAI</h1>
            <p className="text-[11px] text-surface-400 font-medium -mt-0.5">Intelligent Academic Mentoring</p>
          </div>
        </div>

        {/* Sentiment Tracker */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-50 border border-surface-200 shadow-sm">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
          </div>
          <span className="text-[11px] font-semibold text-surface-600">Student Sentiment: Positive</span>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-surface-500 font-medium">
            <Eye className="w-3.5 h-3.5" />
            <span>Viewing as:</span>
          </div>
          <button
            id="role-toggle-btn"
            onClick={onToggleRole}
            className="group relative flex items-center h-9 rounded-full bg-surface-100 p-0.5 border border-surface-200 transition-all hover:shadow-md"
          >
            <span
              className={`absolute h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-md transition-all duration-300 ease-out ${
                role === 'mentor' ? 'left-0.5 w-[108px]' : 'left-[108px] w-[104px]'
              }`}
            />
            <span
              className={`relative z-10 px-4 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 ${
                role === 'mentor' ? 'text-white' : 'text-surface-500'
              }`}
            >
              🎓 Mentor
            </span>
            <span
              className={`relative z-10 px-4 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 ${
                role === 'mentee' ? 'text-white' : 'text-surface-500'
              }`}
            >
              📚 Mentee
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
