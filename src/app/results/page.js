/* ============================================
   Results Page
   Displays the analysis results for the resume
   ============================================ */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import ScoreDisplay from '../../components/ScoreDisplay';
import SuggestionsPanel from '../../components/SuggestionsPanel';
import InsightsPanel from '../../components/InsightsPanel';
import DownloadReport from '../../components/DownloadReport';
import Footer from '../../components/Footer';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    // Retrieve results from session storage
    if (typeof window !== 'undefined') {
      const storedResults = sessionStorage.getItem('resume_analysis_results');
      if (storedResults) {
        try {
          setResults(JSON.parse(storedResults));
        } catch (e) {
          console.error("Failed to parse results", e);
          router.push('/');
        }
      } else {
        // No results found, redirect back to home
        router.push('/');
      }
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center">
        <div className="loader mb-4" />
        <p className="text-surface-400">Loading your results...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center">
        <p className="text-red-400 text-lg mb-4">No results found</p>
        <button
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface-950 font-sans pb-24">
      <Header />
      
      {/* Background orbs for results page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="orb w-[600px] h-[600px] bg-primary-900/10 top-[-20%] right-[-10%]" />
          <div className="orb w-[400px] h-[400px] bg-accent-violet/10 bottom-[-10%] left-[-10%]" />
      </div>

      <div className="relative z-10 pt-32 px-6 sm:px-8 max-w-7xl mx-auto">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium mb-4"
                >
                    Analysis Complete
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-display font-bold text-white mb-2"
                >
                    Resume <span className="gradient-text">Analysis</span>
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-2"
                >
                    <p className="text-surface-400">
                        Detailed report for: <span className="text-surface-200 font-semibold">{results.fileName || 'Your Resume'}</span>
                    </p>
                    {results.jobType && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20"
                        >
                            <span className="material-icons text-blue-300 text-sm">work</span>
                            <span className="text-sm font-medium text-blue-300">
                                Category: {results.jobType.charAt(0).toUpperCase() + results.jobType.slice(1)}
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            <DownloadReport results={results} />
        </div>

        {/* Dashboard Layout - Full Width Vertical Stack */}
        <div className="space-y-8">
            {/* Score Display */}
            <ScoreDisplay 
                score={results.score} 
                breakdown={results.breakdown} 
            />
            
            {/* Suggestions Panel */}
            <SuggestionsPanel suggestions={results.suggestions} />

            {/* AI Insights Panel */}
            {results.insights && (
              <InsightsPanel insights={{ ...results.insights, jobType: results.jobType }} />
            )}
        </div>
      </div>
    </main>
  );
}
