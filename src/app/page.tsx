'use client';

import React from 'react';
import { useStadium, UserRole } from '@/context/StadiumContext';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  const {
    zones,
    incidents,
    setRole
  } = useStadium();

  // Calculate live stats
  const totalIncidents = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  
  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const totalOccupancy = zones.reduce((acc, z) => acc + z.currentOccupancy, 0);
  const averageOccupancyPercent = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
  
  const totalInflow = zones.reduce((acc, z) => acc + z.inflow, 0);

  const handleRoleRoute = (role: UserRole) => {
    setRole(role);
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
        
        {/* Luminous Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan text-xs font-bold border border-brand-cyan/20 mb-4 tracking-wider uppercase">
            <span>🛡️</span> AI-Enabled Operations & Navigation
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4">
            Optimizing Venues & Elevating the{" "}
            <span className="bg-gradient-to-r from-brand-cyan via-brand-teal to-brand-lime bg-clip-text text-transparent">
              Fan Experience
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            StadiumFlow AI combines deterministic crowd engines, step-free Dijkstra navigation, and grounded GenAI summaries into one secure, accessible command shell for FIFA World Cup 2026.
          </p>
        </div>

        {/* Real-time Telemetry Overview Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-brand-elevated border border-brand-border p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Overall Occupancy</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">{averageOccupancyPercent}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">({totalOccupancy.toLocaleString()} / {totalCapacity.toLocaleString()})</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-3">
              <div 
                className="bg-brand-cyan h-1.5 rounded-full" 
                style={{ width: `${averageOccupancyPercent}%` }}
                aria-hidden="true" 
              />
            </div>
          </div>
          
          <div className="bg-brand-elevated border border-brand-border p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Inflow</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-extrabold text-brand-lime tabular-nums">+{totalInflow}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">fans / 10m</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
              Real-time gate sensors active
            </span>
          </div>

          <div className="bg-brand-elevated border border-brand-border p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Unresolved Incidents</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-extrabold tabular-nums ${totalIncidents > 0 ? 'text-status-orange' : 'text-slate-800 dark:text-slate-300'}`}>
                {totalIncidents}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">active alerts</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-3">
              {criticalIncidents > 0 ? `${criticalIncidents} require escalation` : 'All grids operational'}
            </span>
          </div>

          <div className="bg-brand-elevated border border-brand-border p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Zone Closures</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-300 tabular-nums">0</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">gates blocked</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-3 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-green" />
              All gates open
            </span>
          </div>
        </div>

        {/* Main Workflows / Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Fan Experience */}
          <div className="bg-brand-elevated border border-brand-border hover:border-brand-cyan/40 p-6 rounded-2xl flex flex-col justify-between transition-all group hover:-translate-y-1">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl" role="img" aria-label="Ticket and Nav">🎟️</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20">
                  Public Experience
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-brand-cyan transition-colors">Fan Experience</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Calculate crowd-aware, accessible walking routes to your seats or gates. Use the grounded Copilot to ask questions in your preferred language.
              </p>
            </div>
            <Link href="/navigate" onClick={() => handleRoleRoute('fan')}>
              <Button className="w-full" variant="primary">
                Launch Fan Portal
              </Button>
            </Link>
          </div>

          {/* Card 2: Operator Command Center */}
          <div className="bg-brand-elevated border border-brand-border hover:border-brand-cyan/40 p-6 rounded-2xl flex flex-col justify-between transition-all group hover:-translate-y-1">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl" role="img" aria-label="Command Screen">📡</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-status-red/15 text-status-red border border-status-red/20">
                  Operations HQ
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-brand-cyan transition-colors">Operations Command Center</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Inspect live stadium zones and gate sensors. Manage prioritized incidents, view automated severity briefs, and execute crowd detours.
              </p>
            </div>
            <Link href="/operations" onClick={() => handleRoleRoute('operator')}>
              <Button className="w-full" variant="accent">
                Enter Command Console
              </Button>
            </Link>
          </div>

          {/* Card 3: Volunteer Copilot */}
          <div className="bg-brand-elevated border border-brand-border hover:border-brand-cyan/40 p-6 rounded-2xl flex flex-col justify-between transition-all group hover:-translate-y-1">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl" role="img" aria-label="Volunteer Armband">🙋‍♂️</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-lime/15 text-brand-lime border border-brand-lime/20">
                  On-Ground Staff
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-brand-cyan transition-colors">Volunteer Assistant</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Equip volunteers with multilingual, role-specific guidelines. Grounded venue facts ensure accurate fan assistance and quick hazard reporting.
              </p>
            </div>
            <Link href="/assistant" onClick={() => handleRoleRoute('volunteer')}>
              <Button className="w-full" variant="secondary">
                Launch Volunteer Hub
              </Button>
            </Link>
          </div>

        </div>

        {/* GenAI Boundary / Trust Strip */}
        <div className="bg-brand-elevated/45 border border-brand-border p-6 rounded-2xl">
          <h3 className="font-extrabold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan" />
            StadiumFlow AI Guardrails & Architecture
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="text-brand-cyan">1.</span> Deterministic Core
              </span>
              <p>Crowd statistics, routing paths, and incident levels are computed strictly via deterministic code engines, preventing AI hallucinations.</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="text-brand-cyan">2.</span> Grounded Context
              </span>
              <p>Generative AI operates on structured API outputs only. Prohibits prompts from using unverified stadium data or manual overrides.</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="text-brand-cyan">3.</span> Resilient Fallbacks
              </span>
              <p>The system remains fully functional without Gemini API connection. Detours and translations fallback to pre-approved data templates.</p>
            </div>
          </div>
        </div>

      </div>
    </Shell>
  );
}
