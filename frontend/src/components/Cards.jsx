import { useState } from 'react';
import { BookOpen, Lightbulb, BrainCircuit, History, CalendarDays, Copy, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Card Wrapper for glassmorphism and badges
const OutputCard = ({ title, icon: Icon, borderColor, badge, content, children, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof content === 'string') {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={\`bg-slate-900/80 backdrop-blur-md border-l-4 \${borderColor} rounded-r-2xl rounded-l-md p-6 shadow-xl relative\`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={\`p-2 rounded-lg bg-slate-800 \${borderColor.replace('border-', 'text-').replace('-500', '-400')}\`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">{title}</h3>
            {badge && (
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700 mt-1 inline-block">
                Model: {badge}
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={handleCopy} 
          className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-lg transition-colors"
          title="Copy"
        >
          {copied ? <CheckCircle2 size={18} className="text-green-400" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="text-slate-300 text-base leading-relaxed overflow-x-auto">
        {isLoading ? (
          <div className="space-y-3 animate-pulse mt-4">
            <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700/50 rounded w-full"></div>
            <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-800/50">
            {error}
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
};

export const ConceptCard = ({ data, isLoading }) => (
  <OutputCard 
    title="Concept Explanation" 
    icon={BookOpen} 
    borderColor="border-blue-500" 
    badge={data?.model}
    content={data?.content}
    isLoading={isLoading}
    error={data?.error}
  >
    <div className="prose prose-invert prose-blue max-w-none prose-p:leading-relaxed">
      <ReactMarkdown>{data?.content || ''}</ReactMarkdown>
    </div>
  </OutputCard>
);

export const AnalogyCard = ({ data, isLoading }) => (
  <OutputCard 
    title="Desi Analogy" 
    icon={Lightbulb} 
    borderColor="border-orange-500" 
    badge={data?.model}
    content={data?.content}
    isLoading={isLoading}
    error={data?.error}
  >
    <div className="prose prose-invert prose-orange max-w-none p-4 bg-orange-950/20 rounded-xl border border-orange-900/30">
      <ReactMarkdown>{data?.content || ''}</ReactMarkdown>
    </div>
  </OutputCard>
);

export const PyqCard = ({ data, isLoading }) => (
  <OutputCard 
    title="Exam Pattern (PYQ)" 
    icon={History} 
    borderColor="border-green-500" 
    badge={data?.model}
    content={data?.content}
    isLoading={isLoading}
    error={data?.error}
  >
    <div className="prose prose-invert prose-green max-w-none">
      <ReactMarkdown>{data?.content || ''}</ReactMarkdown>
    </div>
  </OutputCard>
);

export const QuizCard = ({ data, isLoading }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = Array.isArray(data?.questions) ? data.questions : [];

  const handleSelect = (qIdx, optIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <OutputCard 
      title="Quick Quiz" 
      icon={BrainCircuit} 
      borderColor="border-purple-500" 
      badge={data?.model}
      isLoading={isLoading}
      error={data?.error}
    >
      <div className="space-y-6 mt-4">
        {questions.length === 0 && !isLoading && !data?.error && (
          <p>No questions generated.</p>
        )}
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <p className="font-medium text-slate-200 mb-3">{qIdx + 1}. {q.q}</p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[qIdx] === optIdx;
                const isCorrect = q.answer === optIdx;
                const hasAnswered = selectedAnswers[qIdx] !== undefined;
                
                let btnClass = "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ";
                
                if (!hasAnswered) {
                  btnClass += "border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600";
                } else {
                  if (isCorrect) {
                    btnClass += "border-green-500 bg-green-500/10 text-green-300";
                  } else if (isSelected && !isCorrect) {
                    btnClass += "border-red-500 bg-red-500/10 text-red-300";
                  } else {
                    btnClass += "border-slate-800 bg-slate-900 opacity-50";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={hasAnswered}
                    onClick={() => handleSelect(qIdx, optIdx)}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </OutputCard>
  );
};

export const StudyPlanCard = ({ data, isLoading }) => {
  const days = Array.isArray(data?.days) ? data.days : [];

  return (
    <OutputCard 
      title="3-Day Study Plan" 
      icon={CalendarDays} 
      borderColor="border-pink-500" 
      badge={data?.model}
      isLoading={isLoading}
      error={data?.error}
    >
      <div className="grid md:grid-cols-3 gap-4 mt-4" id="study-plan-content">
        {days.length === 0 && !isLoading && !data?.error && (
          <p>No plan generated.</p>
        )}
        {days.map((dayObj, i) => (
          <div key={i} className="bg-slate-950/50 rounded-xl border border-pink-900/30 overflow-hidden">
            <div className="bg-pink-900/20 px-4 py-2 border-b border-pink-900/30">
              <h4 className="font-bold text-pink-300">Day {dayObj.day}</h4>
              <p className="text-xs text-pink-200/70 truncate">{dayObj.focus}</p>
            </div>
            <ul className="p-4 space-y-2">
              {Array.isArray(dayObj.tasks) ? dayObj.tasks.map((task, tIdx) => (
                <li key={tIdx} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-pink-500 mt-0.5">•</span> 
                  <span>{task}</span>
                </li>
              )) : null}
            </ul>
          </div>
        ))}
      </div>
    </OutputCard>
  );
};
