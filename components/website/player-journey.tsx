import React from 'react';
import { PLAYER_JOURNEY } from '@/lib/website-constants';
import { CheckCircle2, User, ChevronRight, GraduationCap } from 'lucide-react';

export const PlayerJourney = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Spillerreisen: Din vei til bedre golf
          </h2>
          <p className="text-lg text-slate-600">
            Vi har utviklet en systematisk sti fra dine aller første slag til avansert coaching. 
            Finn ut hvor du er i dag, og se hva som kreves for å nå neste nivå.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Dekorativ linje for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

          {PLAYER_JOURNEY.map((phase, index) => (
            <div key={phase.id} className="relative z-10 group">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm group-hover:shadow-xl group-hover:border-slate-300 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg ${
                    phase.coach === 'Anders' 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-emerald-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <User size={14} className="text-slate-400" />
                    Coach {phase.coach}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {phase.title}
                  </h3>
                  <div className="h-1 w-12 bg-slate-200 group-hover:w-full group-hover:bg-slate-900 transition-all duration-500" />
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {phase.steps.map((step) => (
                    <li key={step} className="flex items-start gap-3 text-slate-600 group/item">
                      <CheckCircle2 
                        className={`mt-0.5 shrink-0 transition-colors ${
                          phase.coach === 'Anders' ? 'text-slate-400 group-hover/item:text-slate-900' : 'text-slate-300 group-hover/item:text-emerald-500'
                        }`} 
                        size={18} 
                      />
                      <span className="text-sm font-medium leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-slate-100">
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors duration-200">
                    {phase.id === 'nybegynner' ? 'Start her' : 'Les mer'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};