import React from 'react';
import { Compass, Users, Briefcase, History, Award, Map } from 'lucide-react';

export type ActiveTab = 'test' | 'transition' | 'result' | 'careers' | 'squad' | 'history';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  hasResult: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  hasResult,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('test')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/60 transition">
            <Compass className="w-5 h-5 text-indigo-400 transition-transform duration-300" />
          </div>

          <div className="whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-base sm:text-lg text-white tracking-tight">
                DISC<span className="text-indigo-400">.tech</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Análise de Perfil para TI
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onSelectTab('test')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'test'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Avaliação DISC
          </button>

          <button
            onClick={() => onSelectTab('transition')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'transition'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Iniciantes & Transição
          </button>

          {hasResult && (
            <button
              onClick={() => onSelectTab('result')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'result'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Seu Relatório
            </button>
          )}

          <button
            onClick={() => onSelectTab('careers')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'careers'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Matriz de Carreiras
          </button>

          <button
            onClick={() => onSelectTab('squad')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'squad'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Simulador de Squad
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer relative whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Histórico
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-700 text-[10px] text-white flex items-center justify-center font-mono font-bold tabular-nums">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('test')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/30 transition cursor-pointer shadow-sm whitespace-nowrap shrink-0"
          >
            {hasResult ? 'Refazer Teste' : 'Iniciar Avaliação'}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet nav sub-bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800 px-2 py-2 overflow-x-auto text-[11px] gap-1">
        <button
          onClick={() => onSelectTab('test')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${activeTab === 'test' ? 'text-white font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Teste
        </button>
        <button
          onClick={() => onSelectTab('transition')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${activeTab === 'transition' ? 'text-white font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Iniciantes
        </button>
        {hasResult && (
          <button
            onClick={() => onSelectTab('result')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${activeTab === 'result' ? 'text-white font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            Relatório
          </button>
        )}
        <button
          onClick={() => onSelectTab('careers')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${activeTab === 'careers' ? 'text-white font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Carreiras
        </button>
        <button
          onClick={() => onSelectTab('squad')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${activeTab === 'squad' ? 'text-white font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Squad
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${activeTab === 'history' ? 'text-white font-bold bg-slate-800' : 'text-slate-400'}`}
        >
          Histórico ({historyCount})
        </button>
      </div>
    </header>
  );
};
