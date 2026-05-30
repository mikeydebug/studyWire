import { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Search, History as HistoryIcon, Download, Share2, Menu, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConceptCard, AnalogyCard, QuizCard, PyqCard, StudyPlanCard } from '../components/Cards';

const SUBJECTS = ['OS', 'DBMS', 'CN', 'Compiler Design', 'Math', 'COA'];

const Dashboard = () => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('OS');
  const [language, setLanguage] = useState('en');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('studywire_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (newEntry) => {
    const updated = [newEntry, ...history.filter(h => h.topic !== newEntry.topic)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('studywire_history', JSON.stringify(updated));
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await axios.post('http://localhost:5001/api/study', {
        topic, subject, language
      });
      
      if (response.data.success) {
        setResults(response.data.data);
        saveToHistory({
          topic, subject, language, 
          data: response.data.data, 
          date: new Date().toISOString()
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setTopic(item.topic);
    setSubject(item.subject);
    setLanguage(item.language);
    setResults(item.data);
    setSidebarOpen(false);
  };

  const downloadPDF = async () => {
    const element = document.getElementById('study-plan-content');
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: '#0f172a' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`StudyPlan-${topic.replace(/\s+/g, '-')}.pdf`);
  };

  const shareResult = async () => {
    const element = document.getElementById('dashboard-results');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#020617' });
      canvas.toBlob(async (blob) => {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        alert('Dashboard screenshot copied to clipboard! Paste it anywhere to share.');
      });
    } catch (err) {
      alert('Failed to generate screenshot.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform z-50 flex flex-col`}>
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text flex items-center gap-2">
            <ArrowLeft size={20} className="text-slate-400" />
            StudyWire
          </Link>
          <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
            <HistoryIcon size={16} /> Recent Queries
          </div>
          {history.length > 0 && (
            <button 
              onClick={() => { setHistory([]); localStorage.removeItem('studywire_history'); }}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
          {history.length === 0 ? (
            <p className="text-slate-600 text-sm">No history yet.</p>
          ) : (
            history.map((h, i) => (
              <button
                key={i}
                onClick={() => loadFromHistory(h)}
                className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors"
              >
                <div className="font-medium text-slate-200 truncate">{h.topic}</div>
                <div className="text-xs text-slate-500 flex gap-2 mt-1">
                  <span>{h.subject}</span>
                  <span>•</span>
                  <span>{new Date(h.date).toLocaleDateString()}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <header className="p-4 md:p-8 pb-4">
          <button className="md:hidden mb-4 text-slate-400" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Explain paging in OS, What is LL(1) grammar?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-2xl py-4 pl-6 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
              />
              <button 
                type="submit" 
                disabled={!topic.trim() || loading}
                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 flex items-center transition-colors disabled:opacity-50"
              >
                <Search size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubject(sub)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      subject === sub 
                        ? 'bg-blue-600 text-white border border-blue-500' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold ${language === 'en' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold ${language === 'hi' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
                >
                  Hinglish
                </button>
              </div>
            </div>
          </form>
        </header>

        {error && (
          <div className="max-w-4xl mx-auto w-full px-4 md:px-8">
            <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl">
              {error}
            </div>
          </div>
        )}

        <div className="flex-1 p-4 md:p-8" id="dashboard-results">
          {(loading || results) && (
            <div className="max-w-7xl mx-auto space-y-8">
              
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-bold">{topic}</h2>
                  <p className="text-slate-400">{subject} • {language === 'hi' ? 'Hinglish' : 'English'}</p>
                </div>
                {results && (
                  <div className="flex gap-2">
                    <button onClick={downloadPDF} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 flex gap-2 items-center text-sm transition-colors">
                      <Download size={16} /> <span className="hidden md:inline">PDF Plan</span>
                    </button>
                    <button onClick={shareResult} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg border border-blue-500 flex gap-2 items-center text-sm transition-colors shadow-lg shadow-blue-500/20">
                      <Share2 size={16} /> <span className="hidden md:inline">Share</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <ConceptCard data={results?.concept} isLoading={loading} />
                <AnalogyCard data={results?.analogy} isLoading={loading} />
                <div className="lg:col-span-2">
                  <StudyPlanCard data={results?.studyPlan} isLoading={loading} />
                </div>
                <PyqCard data={results?.pyq} isLoading={loading} />
                <QuizCard data={results?.quiz} isLoading={loading} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
