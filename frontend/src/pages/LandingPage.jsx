import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, Target, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 relative">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-32 pb-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-blue-400 mb-8 text-sm font-medium">
            <Sparkles size={16} />
            <span>Powered by Anakin Wire</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-50">
            Learn CS concepts <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text">
              like never before.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Struggling with dry textbooks? StudyWire fires 5 AI agents simultaneously to generate concepts, desi analogies, quizzes, and PYQ analysis instantly.
          </p>

          <Link to="/study">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 flex items-center gap-2 mx-auto transition-all"
            >
              Start Studying <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </main>

      {/* How it works */}
      <section className="bg-slate-900/50 py-24 border-y border-slate-800 relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Target, title: '1. Enter a Topic', desc: 'Type any complex CS topic like "Paging in OS" or "LL(1) Parsing".' },
              { icon: Zap, title: '2. Multi-Agent Pipeline', desc: 'Anakin Wire triggers 5 specialized AI agents to process your query simultaneously.' },
              { icon: Brain, title: '3. Master the Concept', desc: 'Get definitions, Indian analogies, quizzes, and a study plan in one dashboard.' },
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 mb-6 border border-slate-700 group-hover:scale-110 transition-transform">
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 relative z-10 bg-slate-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text mb-4 md:mb-0">
            StudyWire
          </div>
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            Built for Indian CS Students in 48 hours.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
