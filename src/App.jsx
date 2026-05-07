import { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import InsightsPanel from './components/InsightsPanel';
import { supabase } from './supabaseClient';

export default function App() {
  const [role, setRole] = useState('mentor');
  const [selectedStudent, setSelectedStudent] = useState(2); // Priya (low attendance demo)
  
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [aiResponses, setAiResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatKeywords, setChatKeywords] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch students with marks
      const { data: studentsData } = await supabase
        .from('students')
        .select(`
          id,
          name,
          attendance,
          marks ( subject, score ),
          attendance_records ( date, status )
        `);
      
      // Transform students to match mockData format
      const formattedStudents = studentsData?.map(s => {
        const marksObj = {};
        s.marks?.forEach(m => {
          marksObj[m.subject] = m.score;
        });
        return {
          id: s.id,
          name: s.name,
          attendance: s.attendance,
          marks: marksObj,
          attendanceRecords: s.attendance_records?.sort((a, b) => new Date(a.date) - new Date(b.date)) || []
        };
      }).sort((a, b) => a.id - b.id) || [];
      
      // Fetch initial messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('id', { ascending: true });
        
      // Fetch AI responses
      const { data: aiData } = await supabase
        .from('ai_responses')
        .select('*');

      const formattedAiResponses = aiData?.map(r => ({
        trigger: r.trigger_word,
        response: r.response_text
      })) || [];

      setStudents(formattedStudents);
      setMessages(messagesData || []);
      setAiResponses(formattedAiResponses);
      setLoading(false);
    }
    
    fetchData();

    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => {
          // Avoid duplicates if we just sent it
          if (prev.find(m => m.text === payload.new.text && m.time === payload.new.time)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, []);

  const toggleRole = () => setRole((r) => (r === 'mentor' ? 'mentee' : 'mentor'));

  const handleSendMessage = async (msg) => {
    setMessages((prev) => [...prev, msg]);
    // Save to Supabase (optional, keeping it live)
    const dbMsg = { sender: msg.sender, name: msg.name, text: msg.text, time: msg.time };
    await supabase.from('messages').insert([dbMsg]);
  };

  const handleChatUpdate = (text) => {
    setChatKeywords((prev) => [...prev, text]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-100 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-surface-500 font-medium text-sm animate-pulse">Connecting to Supabase...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header role={role} onToggleRole={toggleRole} />

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Role Banner */}
        <div className={`mb-6 px-5 py-3 rounded-xl border transition-all duration-300 ${
          role === 'mentor'
            ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-200/60'
            : 'bg-gradient-to-r from-accent-50 to-accent-100/50 border-accent-200/60'
        }`}>
          <p className="text-xs font-semibold text-surface-600">
            {role === 'mentor' ? (
              <span>🎓 <strong className="text-primary-700">Mentor View</strong> — You can see all students, analytics, and AI insights for the session.</span>
            ) : (
              <span>📚 <strong className="text-accent-700">Mentee View</strong> — You can see your own dashboard and chat with your mentor.</span>
            )}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Dashboard + Chat */}
          <div className="col-span-8 space-y-6">
            <Dashboard role={role} selectedStudent={selectedStudent} onSelectStudent={setSelectedStudent} students={students} />
            <Chat 
              role={role} 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              onChatUpdate={handleChatUpdate} 
              aiResponses={aiResponses} 
              student={students.find((s) => s.id === selectedStudent) || students[0]}
            />
          </div>

          {/* Right: Insights */}
          <div className="col-span-4">
            <div className="sticky top-20">
              <InsightsPanel selectedStudent={selectedStudent} chatKeywords={chatKeywords} students={students} />
            </div>
          </div>
        </div>
      </main>

      {/* Keyframe animation */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
