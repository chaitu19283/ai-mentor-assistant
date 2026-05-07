import { useState } from 'react';
import { Sparkles, BookOpen, AlertTriangle, TrendingUp, Lightbulb, Clock, Target, Brain } from 'lucide-react';

function InsightCard({ icon: Icon, title, description, gradient, border, iconBg, show, actionText }) {
  const [accepted, setAccepted] = useState(false);
  if (!show) return null;
  return (
    <div className={`p-4 rounded-xl border ${border} bg-gradient-to-br ${gradient} animate-[fadeSlide_0.4s_ease-out]`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-surface-800 mb-1">{title}</h4>
          <p className="text-[11px] text-surface-500 leading-relaxed mb-2">{description}</p>
          {actionText && (
            <button 
              onClick={() => setAccepted(true)}
              disabled={accepted}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                accepted ? 'bg-surface-200 text-surface-500 cursor-not-allowed' : 'bg-white text-primary-600 shadow-sm border border-primary-100 hover:bg-primary-50'
              }`}
            >
              {accepted ? '✓ Action Scheduled' : actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InsightsPanel({ selectedStudent, chatKeywords, students }) {
  const student = students.find((s) => s.id === selectedStudent) || students[0];
  if (!student) return null;
  const lowAttendance = student.attendance < 75;
  const examMentioned = chatKeywords.some((k) => k.includes('exam'));
  const studyMentioned = chatKeywords.some((k) => k.includes('study'));
  const weakSubjects = Object.entries(student.marks).filter(([, v]) => v < 50);
  const avgMarks = Math.round(Object.values(student.marks).reduce((a, b) => a + b, 0) / Object.values(student.marks).length);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-surface-200/60 shadow-sm p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/25">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-surface-800">AI Insights</h3>
            <p className="text-[10px] text-surface-400">Real-time analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50 border border-violet-100">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <p className="text-[11px] text-violet-600 font-medium">
            Monitoring chat for actionable insights...
          </p>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="space-y-3">
        <InsightCard
          show={lowAttendance}
          icon={AlertTriangle}
          title="⚠ Attendance Warning"
          description={`${student.name}'s attendance is at ${student.attendance}%, below the required 75%. Immediate intervention recommended. Consider scheduling a counseling session.`}
          gradient="from-red-50 to-orange-50"
          border="border-red-200/60"
          iconBg="bg-gradient-to-br from-red-400 to-red-600"
          actionText="Schedule Session"
        />

        <InsightCard
          show={examMentioned}
          icon={BookOpen}
          title="📋 Study Plan Generated"
          description={`Based on the exam discussion, here's a suggested plan: Focus on ${weakSubjects.length > 0 ? weakSubjects.map(([s]) => s).join(', ') : 'weaker areas'} with 2-hour daily sessions. Practice papers recommended for weekends.`}
          gradient="from-blue-50 to-indigo-50"
          border="border-blue-200/60"
          iconBg="bg-gradient-to-br from-blue-400 to-blue-600"
          actionText="Add to Tasks"
        />

        <InsightCard
          show={studyMentioned}
          icon={Target}
          title="🎯 Study Recommendations"
          description="AI recommends a structured approach: Pomodoro technique for focus sessions, spaced repetition for revision, and weekly self-assessment tests."
          gradient="from-emerald-50 to-teal-50"
          border="border-emerald-200/60"
          iconBg="bg-gradient-to-br from-emerald-400 to-emerald-600"
        />

        <InsightCard
          show={weakSubjects.length > 0}
          icon={TrendingUp}
          title="📊 Performance Gap Detected"
          description={`Subjects below passing: ${weakSubjects.map(([s, v]) => `${s} (${v})`).join(', ')}. These need targeted improvement. Peer tutoring or extra classes may help.`}
          gradient="from-amber-50 to-yellow-50"
          border="border-amber-200/60"
          iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
        />

        <InsightCard
          show={avgMarks >= 80}
          icon={Lightbulb}
          title="🌟 High Performer"
          description={`${student.name} is performing well with an average of ${avgMarks}%. Consider advanced challenges or mentoring opportunities for continued growth.`}
          gradient="from-green-50 to-emerald-50"
          border="border-green-200/60"
          iconBg="bg-gradient-to-br from-green-400 to-green-600"
        />

        {/* Static tips */}
        <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200/60">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3.5 h-3.5 text-surface-400" />
            <span className="text-[11px] font-semibold text-surface-500">Quick Tips</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-surface-500">
            <li className="flex items-start gap-1.5">
              <span className="text-primary-500 mt-0.5">•</span>
              Type <strong>"exams"</strong> in chat to trigger a Study Plan
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-primary-500 mt-0.5">•</span>
              Select a student with {'<'}75% attendance for warnings
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-primary-500 mt-0.5">•</span>
              Try <strong>"study"</strong> or <strong>"help"</strong> for more AI responses
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
