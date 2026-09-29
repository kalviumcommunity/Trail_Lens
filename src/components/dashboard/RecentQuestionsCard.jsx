import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RecentQuestionsCard() {
  const { recentQuestions, executeAskQuestion } = useApp();
  const navigate = useNavigate();

  const handleQuestionClick = (q) => {
    executeAskQuestion(q.question);
    navigate('/ask');
  };

  return (
    <div className="rounded-2xl bg-[#0c1427] border border-slate-800/80 p-5 shadow-lg flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <h3 className="font-bold text-white text-base tracking-tight">Recent Questions</h3>
          <NavLink
            to="/saved"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>

        {/* Questions List */}
        <div className="divide-y divide-slate-800/50 mt-1">
          {recentQuestions.slice(0, 5).map((q) => {
            const isAnswered = q.status === "Answered";

            return (
              <div
                key={q.id}
                onClick={() => handleQuestionClick(q)}
                className="py-3 px-2 rounded-xl hover:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                      {q.question}
                    </p>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {q.timestamp}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {isAnswered ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Answered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                      Insufficient Evidence
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
