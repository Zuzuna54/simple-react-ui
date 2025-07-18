'use client';

import React from 'react';

export function SemanticTreeLegend() {
  return (
    <div 
      className="absolute top-6 right-6 z-10 group"
      style={{ width: '280px' }}
    >
      {/* Modern glassmorphism container */}
      <div 
        className="rounded-3xl shadow-2xl backdrop-blur-xl border overflow-hidden"
        style={{ 
          background: 'rgba(15, 23, 42, 0.85)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(16, 185, 129, 0.1) 100%)',
            animation: 'legend-glow 6s ease-in-out infinite alternate'
          }}
        />
        
        <div className="relative z-10 p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Legend
              </h3>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Enhanced Node Types Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="text-cyan-400">⬢</span>
                Node Types
              </h4>
              <div className="space-y-3">
                {/* User Node */}
                <div className="group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 w-6 h-6 rounded-full bg-indigo-500 border-2 border-indigo-300/30 shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl" 
                       style={{ boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}></div>
                  <span className="relative z-10 text-sm text-slate-200 font-medium group-hover:text-white transition-colors duration-200">User</span>
                </div>
                
                {/* Contextual Message */}
                <div className="group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 w-5 h-4 rounded-lg bg-green-500 border-2 border-green-300/30 shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl"
                       style={{ boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)' }}></div>
                  <span className="relative z-10 text-sm text-slate-200 font-medium group-hover:text-white transition-colors duration-200">Contextual Message</span>
                </div>
                
                {/* Noise Message */}
                <div className="group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 w-5 h-4 rounded-lg bg-amber-500 border-2 border-amber-300/30 shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl"
                       style={{ boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)' }}></div>
                  <span className="relative z-10 text-sm text-slate-200 font-medium group-hover:text-white transition-colors duration-200">Noise Message</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Edge Types Section */}
            <div className="pt-2 border-t border-white/10">
              <h4 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="text-pink-400">⚡</span>
                Edge Types
              </h4>
              <div className="space-y-3">
                {/* User-Message Edge */}
                <div className="group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 w-12 h-0.5 bg-indigo-500 rounded-full shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                       style={{ boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)' }}></div>
                  <span className="relative z-10 text-sm text-slate-200 font-medium group-hover:text-white transition-colors duration-200">User-Message</span>
                </div>
                
                {/* Reply Chain Edge */}
                <div className="group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 w-12 h-0.5 bg-blue-500 rounded-full shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                       style={{ boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)' }}></div>
                  <span className="relative z-10 text-sm text-slate-200 font-medium group-hover:text-white transition-colors duration-200">Reply Chain</span>
                </div>
                
                {/* Semantic Link Edge */}
                <div className="group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 w-12 h-0.5 bg-purple-500 rounded-full shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative"
                       style={{ boxShadow: '0 2px 8px rgba(147, 51, 234, 0.4)' }}>
                    <div className="absolute inset-0 border-t-2 border-dashed border-purple-300 opacity-70 rounded-full"></div>
                  </div>
                  <span className="relative z-10 text-sm text-slate-200 font-medium group-hover:text-white transition-colors duration-200">Semantic Link</span>
                </div>
              </div>
            </div>

            {/* Interactive Information Panel */}
            <div className="pt-4 border-t border-white/10">
              <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">💡</span>
                  <span className="text-xs text-slate-300 font-medium">Quick Tip</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hover over nodes to see detailed information. Click nodes to open detailed view with full metadata.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes legend-glow {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
} 