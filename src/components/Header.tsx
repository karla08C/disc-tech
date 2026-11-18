import React from 'react';
import { Compass, Users, Briefcase, History, Award, Map, Sun, Moon } from 'lucide-react';

export type ActiveTab = 'test' | 'transition' | 'result' | 'careers' | 'squad' | 'history';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  hasResult: boolean;
  historyCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  hasResult,
  historyCount,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onSelectTab('test')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-500/60 transition">
            <Compass className="w-5 h-5" />
          </div>

          <div className="whitespace-nowrap">
            <div className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
              DISC<span className="text-indigo-600 dark:text-indigo-400">.tech</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Análise de Perfil para TI
            </div>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelectTab('test')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'test'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Avaliação DISC
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('transition')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'transition'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Iniciantes & Transição
          </button>

          {hasResult && (
            <button
              type="button"
              onClick={() => onSelectTab('result')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'result'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Seu Relatório
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectTab('careers')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'careers'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Matriz de Carreiras
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('squad')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'squad'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Simulador de Squad
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('history')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer relative whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900 border border-transparent'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Histórico
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-800 dark:text-white font-mono font-bold tabular-nums">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Actions: Theme Toggle & Primary CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            title={theme === 'light' ? 'Alternar para Modo Escuro' : 'Alternar para Modo Claro'}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer whitespace-nowrap shrink-0"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Claro</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('test')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white border border-indigo-600/30 transition cursor-pointer shadow-sm whitespace-nowrap shrink-0"
          >
            {hasResult ? 'Refazer Teste' : 'Iniciar Avaliação'}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet nav sub-bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 px-2 py-2 overflow-x-auto text-[11px] gap-1">
        <button
          type="button"
          onClick={() => onSelectTab('test')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'test'
              ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Teste
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('transition')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'transition'
              ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Iniciantes
        </button>
        {hasResult && (
          <button
            type="button"
            onClick={() => onSelectTab('result')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'result'
                ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Relatório
          </button>
        )}
        <button
          type="button"
          onClick={() => onSelectTab('careers')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'careers'
              ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Carreiras
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('squad')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'squad'
              ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Squad
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('history')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'history'
              ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Histórico ({historyCount})
        </button>
      </div>
    </header>
  );
};
