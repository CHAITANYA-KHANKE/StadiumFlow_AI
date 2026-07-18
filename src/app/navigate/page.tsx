'use client';

import React, { useState, useEffect } from 'react';
import { useStadium } from '@/context/StadiumContext';
import { Shell } from '@/components/layout/Shell';
import { calculateRoute } from '@/lib/domain/routing/engine';
import { analyzeCrowd } from '@/lib/domain/crowd/engine';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { RouteResult } from '@/types';

export default function NavigatePage() {
  const {
    pois,
    edges,
    zones,
    requireAccessible,
    setRequireAccessible,
    avoidCongested,
    setAvoidCongested,
    aiEnabled
  } = useStadium();

  const [startPoiId, setStartPoiId] = useState<string>('');
  const [endPoiId, setEndPoiId] = useState<string>('');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [aiExplainText, setAiExplainText] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Filter out closed POIs as starting/ending choices, unless it's already selected
  const activePois = pois.filter(p => !p.isClosed);

  const handleCalculateRoute = () => {
    if (!startPoiId || !endPoiId) return;
    
    const result = calculateRoute(pois, edges, zones, startPoiId, endPoiId, {
      requireAccessible,
      avoidCongested
    });
    
    setRouteResult(result);
    setIsCalculated(true);
    setAiExplainText(''); // reset explanation
  };

  // Trigger AI route explanation
  useEffect(() => {
    if (!routeResult || !isCalculated) return;

    const generateExplanation = async () => {
      setIsLoadingAi(true);
      
      const startName = pois.find(p => p.id === startPoiId)?.name || '';
      const endName = pois.find(p => p.id === endPoiId)?.name || '';
      const accessibleText = requireAccessible ? 'step-free/wheelchair-friendly' : 'standard';
      const detourText = routeResult.costExplain.congestionPenalty > 0 
        ? 'detoured around heavy congestion to save time' 
        : 'optimized for physical distance';

      // Fallback text
      const fallbackExplanation = `Standard Route Description: Path starts at ${startName} and navigates to ${endName}. It has been configured as ${accessibleText} and is ${detourText}. Total distance: ${routeResult.totalDistance} meters. Estimated walking time: ${routeResult.etaMinutes} minutes.`;

      if (!aiEnabled) {
        setAiExplainText(fallbackExplanation);
        setIsLoadingAi(false);
        return;
      }

      // If AI is enabled, mock a grounded API explanation call
      // In Phase 5, we will wire this up to the server side endpoint
      try {
        const response = await fetch('/api/ai/explain-route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startPoiId,
            endPoiId,
            routeResult,
            requireAccessible,
            avoidCongested
          })
        });

        if (response.ok) {
          const data = await response.json();
          setAiExplainText(data.explanation);
        } else {
          setAiExplainText(fallbackExplanation);
        }
      } catch {
        setAiExplainText(fallbackExplanation);
      } finally {
        setIsLoadingAi(false);
      }
    };

    generateExplanation();
  }, [routeResult, isCalculated, aiEnabled, startPoiId, endPoiId, pois, requireAccessible, avoidCongested]);

  const handleSwapEndpoints = () => {
    const temp = startPoiId;
    setStartPoiId(endPoiId);
    setEndPoiId(temp);
    setIsCalculated(false);
    setRouteResult(null);
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow flex flex-col gap-6">
        
        {/* Navigation title */}
        <div className="border-b border-brand-border pb-4">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">Smart Crowd-Aware Navigation</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Compute optimized step-free paths and avoid real-time congestion bottlenecks</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Panel (Span 4) */}
          <div className="lg:col-span-4 bg-brand-elevated border border-brand-border p-6 rounded-2xl flex flex-col gap-6">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-300">Route Planner</h2>
            
            {/* Start point */}
            <div className="flex flex-col gap-2">
              <label htmlFor="start-poi-select" className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Starting Location:
              </label>
              <select
                id="start-poi-select"
                value={startPoiId}
                onChange={(e) => {
                  setStartPoiId(e.target.value);
                  setIsCalculated(false);
                }}
                className="bg-brand-dark text-slate-800 dark:text-slate-200 text-sm px-3 py-2 rounded-lg border border-brand-border focus:border-brand-cyan focus:outline-none cursor-pointer"
              >
                <option value="">Select origin...</option>
                {activePois.map(poi => (
                  <option key={poi.id} value={poi.id}>
                    {poi.name} ({poi.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <button
                onClick={handleSwapEndpoints}
                disabled={!startPoiId && !endPoiId}
                className="bg-brand-dark hover:bg-slate-200 dark:hover:bg-slate-800 border border-brand-border text-brand-cyan w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Swap starting and ending locations"
              >
                ↑↓
              </button>
            </div>

            {/* End point */}
            <div className="flex flex-col gap-2">
              <label htmlFor="end-poi-select" className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Destination:
              </label>
              <select
                id="end-poi-select"
                value={endPoiId}
                onChange={(e) => {
                  setEndPoiId(e.target.value);
                  setIsCalculated(false);
                }}
                className="bg-brand-dark text-slate-800 dark:text-slate-200 text-sm px-3 py-2 rounded-lg border border-brand-border focus:border-brand-cyan focus:outline-none cursor-pointer"
              >
                <option value="">Select destination...</option>
                {activePois.map(poi => (
                  <option key={poi.id} value={poi.id}>
                    {poi.name} ({poi.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Accessibility / Congestion Toggles */}
            <div className="flex flex-col gap-3 border-t border-brand-border/60 pt-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Routing Settings:</span>
              
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={requireAccessible}
                  onChange={(e) => {
                    setRequireAccessible(e.target.checked);
                    setIsCalculated(false);
                  }}
                  className="w-4 h-4 rounded text-brand-cyan bg-brand-dark border-brand-border focus:ring-brand-cyan cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  ♿ Step-Free (Wheelchair Access)
                </span>
              </label>
              
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={avoidCongested}
                  onChange={(e) => {
                    setAvoidCongested(e.target.checked);
                    setIsCalculated(false);
                  }}
                  className="w-4 h-4 rounded text-brand-cyan bg-brand-dark border-brand-border focus:ring-brand-cyan cursor-pointer"
                />
                <span>⚠️ Avoid Highly Congested Zones</span>
              </label>
            </div>

            <Button
              onClick={handleCalculateRoute}
              disabled={!startPoiId || !endPoiId || startPoiId === endPoiId}
              variant="primary"
              className="w-full mt-2 py-2.5"
            >
              Calculate Route
            </Button>
          </div>

          {/* Right Column: Routing Results (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* State A: Not calculated */}
            {!isCalculated && (
              <div className="bg-brand-elevated/40 border border-brand-border border-dashed p-16 rounded-2xl text-center text-slate-500 flex flex-col items-center gap-3">
                <span className="text-4xl" role="img" aria-label="Compass icon">🧭</span>
                <span className="text-sm font-semibold">Enter your starting point and destination in the route planner to generate crowd-aware navigation.</span>
              </div>
            )}

            {/* State B: No route found */}
            {isCalculated && routeResult === null && (
              <div className="bg-brand-elevated border border-l-4 border-l-status-red border-brand-border p-6 rounded-r-2xl flex flex-col gap-2">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                  <span className="text-status-red">✖</span> Route Blocked
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  No path could be calculated with your active settings. This occurs if step-free access is required but target paths contain stairs (e.g. upper stands), or if vital concourse links are temporarily closed.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button variant="secondary" onClick={() => {
                    setRequireAccessible(false);
                    setAvoidCongested(false);
                    setIsCalculated(false);
                  }} className="py-1 px-3 text-xs h-auto">
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}

            {/* State C: Success path */}
            {isCalculated && routeResult && (
              <div className="flex flex-col gap-6">
                
                {/* Route Overview card */}
                <div className="bg-brand-elevated border border-brand-border p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 tracking-wider">Calculated Path</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-brand-cyan tabular-nums">{routeResult.etaMinutes}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase">minutes walk</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 tabular-nums">{routeResult.totalDistance}m</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {routeResult.isAccessible && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                        ♿ Step-Free
                      </span>
                    )}
                    {routeResult.costExplain.congestionPenalty > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wide">
                        ⚠️ Detoured
                      </span>
                    )}
                  </div>
                </div>

                {/* Detour Warnings */}
                {routeResult.costExplain.congestionPenalty > 0 && (
                  <div className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 p-4 rounded-xl text-xs flex gap-2.5 items-start leading-relaxed">
                    <span>⚠️</span>
                    <div>
                      <span className="font-bold">Congestion Detour Active:</span> The routing engine has diverted you around congested stadium concourses to reduce bottlenecks. Your travel cost was adjusted by +{routeResult.costExplain.congestionPenalty}m equivalent.
                    </div>
                  </div>
                )}

                {/* AI Route Explanation */}
                <div className="bg-brand-elevated border border-brand-border p-6 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-brand-border pb-2">
                    <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                      Route Context Explanation
                    </h3>
                    <span className="text-[10px] text-slate-500 font-bold">
                      {aiEnabled && !isLoadingAi ? 'GenAI Grounded' : 'Deterministic fallback'}
                    </span>
                  </div>
                  
                  {isLoadingAi ? (
                    <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
                      <svg className="animate-spin h-4 w-4 text-brand-cyan" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing route metrics...
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {aiExplainText}
                    </p>
                  )}
                </div>

                {/* Path Itinerary List */}
                <div className="bg-brand-elevated border border-brand-border p-6 rounded-2xl flex flex-col gap-4">
                  <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Directions & Segment Breakdown
                  </h3>
                  
                  <div className="flex flex-col relative border-l border-brand-border ml-2 pl-6 gap-6">
                    {routeResult.path.map((nodeId, index) => {
                      const poi = pois.find(p => p.id === nodeId);
                      if (!poi) return null;
                      
                      const zone = zones.find(z => z.id === poi.zoneId);
                      const zoneCongestion = zone 
                        ? analyzeCrowd(zone, zone.id.includes('GATE')).congestionLevel
                        : 'GREEN';
                        
                      const isStart = index === 0;
                      const isEnd = index === routeResult.path.length - 1;

                      return (
                        <div key={poi.id} className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          
                          {/* Bullet marker */}
                          <span 
                            className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 flex items-center justify-center bg-brand-dark transition-all ${
                              isStart ? 'border-brand-cyan w-5 h-5 -left-[33px]' : isEnd ? 'border-brand-lime w-5 h-5 -left-[33px]' : 'border-slate-600'
                            }`}
                            aria-hidden="true"
                          >
                            {isStart ? '●' : isEnd ? '✔' : ''}
                          </span>

                          <div className="flex flex-col">
                            <span className={`text-xs font-bold ${isStart || isEnd ? 'text-slate-900 dark:text-slate-100 text-sm' : 'text-slate-700 dark:text-slate-300'}`}>
                              {poi.name}{" "}
                              {isStart && <span className="text-[10px] text-slate-500 font-normal ml-1">(Origin)</span>}
                              {isEnd && <span className="text-[10px] text-slate-500 font-normal ml-1">(Destination)</span>}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                              POI Type: {poi.type} | Zone: {zone ? zone.name : 'Unknown'}
                            </span>
                          </div>

                          <div className="flex gap-2 items-center">
                            {!poi.isAccessible && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase">
                                🚏 Stairs
                              </span>
                            )}
                            <StatusBadge status={zoneCongestion} />
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </Shell>
  );
}
