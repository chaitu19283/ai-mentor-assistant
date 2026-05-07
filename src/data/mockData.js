export const STUDENTS = [
  { id: 1, name: 'Aarav Sharma', marks: { math: 78, physics: 65, chemistry: 82, english: 91, cs: 88 }, attendance: 92 },
  { id: 2, name: 'Priya Patel', marks: { math: 55, physics: 48, chemistry: 60, english: 72, cs: 45 }, attendance: 68 },
  { id: 3, name: 'Rohan Gupta', marks: { math: 90, physics: 85, chemistry: 88, english: 76, cs: 95 }, attendance: 96 },
  { id: 4, name: 'Sneha Reddy', marks: { math: 42, physics: 38, chemistry: 55, english: 65, cs: 50 }, attendance: 58 },
  { id: 5, name: 'Kiran Das',   marks: { math: 70, physics: 72, chemistry: 68, english: 80, cs: 74 }, attendance: 74 },
];

export const SUBJECT_LABELS = {
  math: 'Mathematics',
  physics: 'Physics',
  chemistry: 'Chemistry',
  english: 'English',
  cs: 'Comp. Sci.',
};

export const SUBJECT_COLORS = {
  math: '#6366f1',
  physics: '#8b5cf6',
  chemistry: '#06b6d4',
  english: '#10b981',
  cs: '#f59e0b',
};

export const INITIAL_MESSAGES = [
  { id: 1, sender: 'mentor', name: 'Dr. Mehra', text: 'Good morning everyone. Let\'s review the mid-term progress today.', time: '09:00 AM' },
  { id: 2, sender: 'mentee', name: 'Priya Patel', text: 'Good morning, Sir. I wanted to discuss my performance.', time: '09:01 AM' },
  { id: 3, sender: 'ai', name: 'AI Assistant', text: 'I\'ve prepared an overview of Priya\'s mid-term marks and attendance. Her attendance is currently at 68%, which is below the 75% threshold.', time: '09:01 AM' },
  { id: 4, sender: 'mentor', name: 'Dr. Mehra', text: 'Priya, your attendance needs immediate attention. What\'s been going on?', time: '09:02 AM' },
  { id: 5, sender: 'mentee', name: 'Priya Patel', text: 'I\'ve been struggling with the commute, Sir. But I\'ll make sure to improve.', time: '09:03 AM' },
];

export const AI_RESPONSES = [
  { trigger: 'exam', response: 'Based on the conversation about exams, I\'ve generated a personalized study plan. Key focus areas have been identified based on mid-term performance.' },
  { trigger: 'study', response: 'I recommend a structured study schedule: 2 hours of focused study per weak subject daily, with practice tests every weekend.' },
  { trigger: 'help', response: 'I\'ve analyzed the academic profile and can suggest targeted resources. Would you like me to generate a detailed improvement plan?' },
  { trigger: 'attendance', response: 'Attendance tracking shows a pattern. I recommend setting up daily check-in reminders and identifying the root causes of absences.' },
  { trigger: 'marks', response: 'Looking at the marks distribution, there\'s a clear gap between strong and weak subjects. A balanced approach to study time allocation is recommended.' },
];
