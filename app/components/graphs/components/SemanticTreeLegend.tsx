'use client';

import React from 'react';

export function SemanticTreeLegend() {
  return (
    <div 
      className="absolute top-6 right-6 rounded-2xl shadow-2xl backdrop-blur-md border z-10"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        width: '240px'
      }}
    >
      <div className="p-5 space-y-5">
        <div className="border-b border-slate-700/50 pb-3">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Legend
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-200 mb-3 uppercase tracking-wide">
              Node Types
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-indigo-300/30 shadow-sm"></div>
                <span className="text-slate-200 font-medium">User</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded-lg bg-green-500 border-2 border-green-300/30 shadow-sm"></div>
                <span className="text-slate-200 font-medium">Contextual Message</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 rounded-lg bg-amber-500 border-2 border-amber-300/30 shadow-sm"></div>
                <span className="text-slate-200 font-medium">Noise Message</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-700/40">
            <h4 className="text-xs font-semibold text-slate-200 mb-3 uppercase tracking-wide">
              Edge Types
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-0.5 bg-indigo-500 rounded-full shadow-sm"></div>
                <span className="text-slate-200 font-medium">User-Message</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-0.5 bg-blue-500 rounded-full shadow-sm"></div>
                <span className="text-slate-200 font-medium">Reply Chain</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-0.5 bg-purple-500 rounded-full shadow-sm relative">
                  <div className="absolute inset-0 border-t-2 border-dashed border-purple-300 opacity-70 rounded-full"></div>
                </div>
                <span className="text-slate-200 font-medium">Semantic Link</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 