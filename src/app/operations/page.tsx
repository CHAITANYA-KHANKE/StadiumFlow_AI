'use client';

import React, { useState } from 'react';
import { useStadium } from '@/context/StadiumContext';
import { Shell } from '@/components/layout/Shell';
import { analyzeCrowd } from '@/lib/domain/crowd/engine';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { AlertCard } from '@/components/ui/AlertCard';
import { AccessibleDataTable } from '@/components/ui/AccessibleDataTable';
import { Incident, Zone } from '@/types';

interface SeatDot {
  x: number;
  y: number;
  isAccessible?: boolean;
}

const getZoneSeats = (zoneId: string): SeatDot[] => {
  const seats: SeatDot[] = [];
  const centerX = 400;
  const centerY = 200;
  
  if (zoneId === 'ZONE_GATE_A') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const isAccessible = r === 1 && c === 0;
        seats.push({ x: 90 + c * 16, y: 180 + r * 16, isAccessible });
      }
    }
  } else if (zoneId === 'ZONE_GATE_B') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const isAccessible = r === 1 && c === 3;
        seats.push({ x: 650 + c * 16, y: 180 + r * 16, isAccessible });
      }
    }
  } else if (zoneId === 'ZONE_NORTH_CONC') {
    const r1_x = 180;
    const r1_y = 90;
    const r2_x = 210;
    const r2_y = 110;
    for (let row = 0; row < 2; row++) {
      const rx = row === 0 ? r1_x : r2_x;
      const ry = row === 0 ? r1_y : r2_y;
      for (let i = 0; i < 12; i++) {
        const angle = 205 + i * 11.8;
        const rad = (angle * Math.PI) / 180;
        const x = centerX + rx * Math.cos(rad);
        const y = centerY + ry * Math.sin(rad);
        const isAccessible = row === 1 && i === 6;
        seats.push({ x, y, isAccessible });
      }
    }
  } else if (zoneId === 'ZONE_SOUTH_CONC') {
    const r1_x = 180;
    const r1_y = 90;
    const r2_x = 210;
    const r2_y = 110;
    for (let row = 0; row < 2; row++) {
      const rx = row === 0 ? r1_x : r2_x;
      const ry = row === 0 ? r1_y : r2_y;
      for (let i = 0; i < 12; i++) {
        const angle = 25 + i * 11.8;
        const rad = (angle * Math.PI) / 180;
        const x = centerX + rx * Math.cos(rad);
        const y = centerY + ry * Math.sin(rad);
        const isAccessible = row === 1 && i === 6;
        seats.push({ x, y, isAccessible });
      }
    }
  } else if (zoneId === 'ZONE_STAND_100') {
    for (let row = 0; row < 3; row++) {
      const rx = 160 + row * 18;
      const ry = 80 + row * 10;
      for (let i = 0; i < 6; i++) {
        const angle = -18 + i * 7.2;
        const rad = (angle * Math.PI) / 180;
        const x = centerX + rx * Math.cos(rad);
        const y = centerY + ry * Math.sin(rad);
        seats.push({ x, y });
      }
    }
  } else if (zoneId === 'ZONE_STAND_200') {
    for (let row = 0; row < 3; row++) {
      const rx = 230 + row * 20;
      const ry = 125 + row * 12;
      for (let i = 0; i < 6; i++) {
        const angle = -18 + i * 7.2;
        const rad = (angle * Math.PI) / 180;
        const x = centerX + rx * Math.cos(rad);
        const y = centerY + ry * Math.sin(rad);
        seats.push({ x, y });
      }
    }
  } else if (zoneId === 'ZONE_VIP') {
    for (let row = 0; row < 3; row++) {
      const rx = 160 + row * 18;
      const ry = 80 + row * 10;
      for (let i = 0; i < 6; i++) {
        const angle = 162 + i * 7.2;
        const rad = (angle * Math.PI) / 180;
        const x = centerX + rx * Math.cos(rad);
        const y = centerY + ry * Math.sin(rad);
        const isAccessible = row === 0 && i === 2;
        seats.push({ x, y, isAccessible });
      }
    }
  } else if (zoneId === 'ZONE_TRANSIT') {
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 8; c++) {
        const isAccessible = r === 1 && (c === 2 || c === 5);
        seats.push({ x: 340 + c * 17, y: 360 + r * 14, isAccessible });
      }
    }
  }
  
  return seats;
};

export default function OperationsPage() {
  const {
    zones,
    incidents,
    selectedZoneId,
    setSelectedZoneId,
    selectedIncidentId,
    setSelectedIncidentId,
    updateZoneOccupancy,
    toggleAction,
    addIncident,
    resetData,
    aiEnabled
  } = useStadium();

  const [simValue, setSimValue] = useState<number>(300);

  // Active zone
  const activeZone = zones.find(z => z.id === selectedZoneId) || null;
  const activeZoneAnalysis = activeZone ? analyzeCrowd(activeZone, activeZone.id.includes('GATE')) : null;

  // Active incident
  const activeIncident = incidents.find(i => i.id === selectedIncidentId) || null;

  // Top level stats
  const unresolvedIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalCount = unresolvedIncidents.filter(i => i.severity === 'CRITICAL').length;
  const highCount = unresolvedIncidents.filter(i => i.severity === 'HIGH').length;

  const totalOccupancy = zones.reduce((acc, z) => acc + z.currentOccupancy, 0);
  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const totalInflow = zones.reduce((acc, z) => acc + z.inflow, 0);

  // Columns for Accessible Data Table (alternative to SVG map)
  const zoneColumns = [
    {
      header: 'Zone Name',
      accessor: (zone: Zone) => <span className="font-bold text-slate-200">{zone.name}</span>
    },
    {
      header: 'Occupancy / Capacity',
      accessor: (zone: Zone) => (
        <span className="tabular-nums">
          {zone.currentOccupancy.toLocaleString()} / {zone.capacity.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Congestion Level',
      accessor: (zone: Zone) => {
        const analysis = analyzeCrowd(zone, zone.id.includes('GATE'));
        return <StatusBadge status={analysis.congestionLevel} />;
      }
    },
    {
      header: 'Action',
      accessor: (zone: Zone) => (
        <Button
          variant="ghost"
          className="py-1 px-2.5 text-xs h-auto"
          onClick={() => setSelectedZoneId(zone.id)}
          aria-label={`Inspect ${zone.name}`}
        >
          Inspect
        </Button>
      )
    }
  ];

  // Map congestion level to SVG boundary colors (low opacity background for seat visibility)
  const getZoneColor = (zone: Zone) => {
    const analysis = analyzeCrowd(zone, zone.id.includes('GATE'));
    const isSelected = selectedZoneId === zone.id;
    
    if (isSelected) {
      switch (analysis.congestionLevel) {
        case 'RED': return 'fill-red-500/10 stroke-red-500 stroke-2';
        case 'ORANGE': return 'fill-orange-500/10 stroke-orange-500 stroke-2';
        case 'YELLOW': return 'fill-yellow-500/10 stroke-yellow-500 stroke-2';
        default: return 'fill-brand-cyan/10 stroke-brand-cyan stroke-2';
      }
    }
    
    switch (analysis.congestionLevel) {
      case 'RED': return 'fill-red-500/5 stroke-red-500/20 hover:fill-red-500/10';
      case 'ORANGE': return 'fill-orange-500/5 stroke-orange-500/20 hover:fill-orange-500/10';
      case 'YELLOW': return 'fill-yellow-500/5 stroke-yellow-500/20 hover:fill-yellow-500/10';
      default: return 'fill-brand-dark/20 stroke-brand-border/40 hover:fill-brand-dark/40';
    }
  };

  const handleSimulateOccupancy = () => {
    if (selectedZoneId) {
      updateZoneOccupancy(selectedZoneId, simValue);
    }
  };

  const handleTriggerIncident = () => {
    if (!selectedZoneId) return;
    const targetZone = zones.find(z => z.id === selectedZoneId);
    if (!targetZone) return;

    const newId = `INC_${Date.now()}`;
    const newInc: Incident = {
      id: newId,
      title: `Sensor Alert: ${targetZone.name} Surge`,
      description: `Elevated density flagged in ${targetZone.name}. Volumetric inflow has exceeded standard safety thresholds.`,
      zoneId: selectedZoneId,
      severity: targetZone.currentOccupancy >= targetZone.capacity * 0.9 ? 'CRITICAL' : 'HIGH',
      status: 'OPEN',
      timestamp: new Date().toISOString(),
      reportedBy: 'Automatic Video Telemetry',
      evidence: `Estimated density: ${(targetZone.currentOccupancy / targetZone.capacity * 100).toFixed(0)}%`,
      recommendedActions: [
        { id: `ACT_${newId}_1`, title: 'Deploy Crowd Marshalls', description: 'Deploy secondary volunteer team to guide exiting fans.', isCompleted: false },
        { id: `ACT_${newId}_2`, title: 'Initiate Dynamic Detour', description: 'Enable avoid-congested route calculation for this zone.', isCompleted: false }
      ]
    };
    addIncident(newInc);
    setSelectedIncidentId(newId);
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 py-6 flex-grow flex flex-col gap-6">
        
        {/* Dashboard Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">Operations Command Center</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live telemetry and real-time incident escalation console</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={resetData} className="px-3 py-1.5 text-xs">
              Reset Ground Data
            </Button>
          </div>
        </div>

        {/* Top telemetry card row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-brand-elevated border border-brand-border p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Stadium Crowd</span>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 tabular-nums">
              {totalOccupancy.toLocaleString()}{" "}
              <span className="text-xs font-normal text-slate-500">/ {totalCapacity.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Global load: {((totalOccupancy/totalCapacity)*100).toFixed(0)}%</p>
          </div>

          <div className="bg-brand-elevated border border-brand-border p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Inflow Rate</span>
            <div className="text-2xl font-black text-brand-lime mt-1 tabular-nums">+{totalInflow.toLocaleString()}</div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Sum of all entrance gates</p>
          </div>

          <div className="bg-brand-elevated border border-brand-border p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Critical Escalations</span>
            <div className="text-2xl font-black text-status-red mt-1 tabular-nums">{criticalCount}</div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Requires emergency dispatch</p>
          </div>

          <div className="bg-brand-elevated border border-brand-border p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">High Alerts</span>
            <div className="text-2xl font-black text-status-orange mt-1 tabular-nums">{highCount}</div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Requires crowd re-routing</p>
          </div>
        </div>

        {/* Main interactive grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Map & Accessible table (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* SVG Stadium Map */}
            <div className="bg-brand-elevated border border-brand-border p-4 rounded-2xl flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-300">Live Stadium Zone Layout</h2>
                <span className="text-[10px] text-slate-500 font-semibold">Click a zone to inspect telemetry</span>
              </div>
              
              {/* Interactive SVG stadium layout */}
              <div className="aspect-[2/1] w-full bg-brand-dark/20 border border-brand-border rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-4">
                <svg viewBox="0 0 800 440" className="w-full h-full max-h-[380px]">
                  {/* Soccer Field (Center Pitch) */}
                  <g className="select-none pointer-events-none">
                    {/* Grass Field */}
                    <rect x="290" y="140" width="220" height="120" rx="4" className="fill-green-700/80 dark:fill-green-900/40 stroke-green-500/50 stroke-2" />
                    
                    {/* Field lines */}
                    <rect x="296" y="146" width="208" height="108" rx="2" className="fill-none stroke-white/20 stroke-1" />
                    
                    {/* Halfway line */}
                    <line x1="400" y1="146" x2="400" y2="254" className="stroke-white/20 stroke-1" />
                    
                    {/* Center Circle */}
                    <circle cx="400" cy="200" r="22" className="fill-none stroke-white/20 stroke-1" />
                    <circle cx="400" cy="200" r="2" className="fill-white/20" />
                    
                    {/* Penalty Boxes */}
                    <rect x="296" y="175" width="25" height="50" className="fill-none stroke-white/20 stroke-1" />
                    <rect x="479" y="175" width="25" height="50" className="fill-none stroke-white/20 stroke-1" />
                  </g>

                  {/* Sectors Boundary Paths (clickable background) */}
                  <g className="cursor-pointer transition-all">
                    {/* 1. Gate A (West Entrance) */}
                    <path 
                      d="M 120,180 A 40,40 0 0,1 120,220 L 190,210 A 10,10 0 0,0 190,190 Z" 
                      className={`${getZoneColor(zones[0])} cursor-pointer transition-colors duration-200`}
                      onClick={() => setSelectedZoneId(zones[0].id)}
                    />
                    
                    {/* 2. Gate B (East Entrance) */}
                    <path 
                      d="M 680,180 A 40,40 0 0,0 680,220 L 610,210 A 10,10 0 0,1 610,190 Z" 
                      className={`${getZoneColor(zones[1])} cursor-pointer transition-colors duration-200`}
                      onClick={() => setSelectedZoneId(zones[1].id)}
                    />

                    {/* 3. North Concourse */}
                    <path 
                      d="M 240,60 L 560,60 L 520,110 L 280,110 Z" 
                      className={`${getZoneColor(zones[2])} cursor-pointer transition-colors duration-200`}
                      onClick={() => setSelectedZoneId(zones[2].id)}
                    />

                    {/* 4. South Concourse */}
                    <path 
                      d="M 240,340 L 560,340 L 520,290 L 280,290 Z" 
                      className={`${getZoneColor(zones[3])} cursor-pointer transition-colors duration-200`}
                      onClick={() => setSelectedZoneId(zones[3].id)}
                    />

                    {/* 5. Stand 100 (East Stand) */}
                    <path 
                      d="M 570,120 L 650,120 L 590,280 L 540,240 Z" 
                      className={`${getZoneColor(zones[4])} cursor-pointer transition-colors duration-200`}
                      onClick={() => setSelectedZoneId(zones[4].id)}
                    />

                    {/* 6. Stand 200 (Upper East) */}
                    <path 
                      d="M 660,110 L 740,110 L 680,290 L 620,260 Z" 
                      className={`${getZoneColor(zones[5])} cursor-pointer transition-colors duration-200`}
                      onClick={() => setSelectedZoneId(zones[5].id)}
                    />

                    {/* 7. VIP Lounge */}
                    <path 
                      d="M 230,120 L 180,240 L 230,280 L 260,200 Z" 
                      className={`${getZoneColor(zones[6])} cursor-pointer transition-colors duration-200`}
                      onClick={() => setSelectedZoneId(zones[6].id)}
                    />

                    {/* 8. Transit Hub Plaza */}
                    <rect 
                      x="300" y="350" width="200" height="35" rx="5" 
                      className={`${getZoneColor(zones[7])} cursor-pointer transition-colors duration-200`}
                      onClick={() => setSelectedZoneId(zones[7].id)}
                    />
                  </g>

                  {/* Render Seat dots inside each zone */}
                  <g className="pointer-events-none select-none">
                    {zones.map((zone) => {
                      const zoneSeats = getZoneSeats(zone.id);
                      const occupancyRatio = zone.currentOccupancy / zone.capacity;
                      const occupiedCount = Math.round(occupancyRatio * zoneSeats.length);

                      return zoneSeats.map((seat, seatIdx) => {
                        const isOccupied = seatIdx < occupiedCount;
                        
                        let seatColorClass = "fill-slate-300 stroke-slate-400/50 dark:fill-slate-700/60 dark:stroke-slate-600/40"; 
                        if (isOccupied) {
                          const analysis = analyzeCrowd(zone, zone.id.includes('GATE'));
                          switch (analysis.congestionLevel) {
                            case 'RED': seatColorClass = "fill-status-red stroke-red-600"; break;
                            case 'ORANGE': seatColorClass = "fill-status-orange stroke-orange-600"; break;
                            case 'YELLOW': seatColorClass = "fill-status-yellow stroke-yellow-600"; break;
                            default: seatColorClass = "fill-status-green stroke-green-600"; break;
                          }
                        }

                        if (seat.isAccessible) {
                          return (
                            <g key={`${zone.id}-${seatIdx}`}>
                              <circle 
                                cx={seat.x} 
                                cy={seat.y} 
                                r="7" 
                                className={`${isOccupied ? 'fill-blue-600 stroke-blue-500' : 'fill-blue-500/10 stroke-blue-500/30'} transition-all`}
                              />
                              <text 
                                x={seat.x} 
                                y={seat.y + 2.5} 
                                className={`font-black text-[7px] text-center select-none pointer-events-none ${isOccupied ? 'fill-white' : 'fill-blue-500'}`}
                                textAnchor="middle"
                              >
                                ♿
                              </text>
                            </g>
                          );
                        }

                        return (
                          <circle
                            key={`${zone.id}-${seatIdx}`}
                            cx={seat.x}
                            cy={seat.y}
                            r="3.5"
                            className={`${seatColorClass} transition-all`}
                          />
                        );
                      });
                    })}
                  </g>

                  {/* Accessible Label and Titles (Adapts for light/dark mode) */}
                  <g className="pointer-events-none select-none">
                    <text x="100" y="235" className="fill-slate-600 dark:fill-slate-300 font-extrabold text-[9px] text-center" textAnchor="middle">GATE A</text>
                    <text x="700" y="235" className="fill-slate-600 dark:fill-slate-300 font-extrabold text-[9px] text-center" textAnchor="middle">GATE B</text>
                    <text x="400" y="80" className="fill-slate-600 dark:fill-slate-300 font-black text-[10px] text-center" textAnchor="middle">NORTH CONCOURSE</text>
                    <text x="400" y="325" className="fill-slate-600 dark:fill-slate-300 font-black text-[10px] text-center" textAnchor="middle">SOUTH CONCOURSE</text>
                    <text x="595" y="185" className="fill-slate-600 dark:fill-slate-300 font-extrabold text-[9px] text-center" textAnchor="middle">STAND 100</text>
                    <text x="670" y="145" className="fill-slate-600 dark:fill-slate-300 font-extrabold text-[9px] text-center" textAnchor="middle">STAND 200</text>
                    <text x="210" y="175" className="fill-slate-600 dark:fill-slate-300 font-extrabold text-[9px] text-center" textAnchor="middle">VIP LOUNGE</text>
                    <text x="400" y="372" className="fill-slate-600 dark:fill-slate-300 font-extrabold text-[9px] text-center" textAnchor="middle">TRANSIT HUB PLAZA</text>
                  </g>
                </svg>

                {/* SVG Seating Map Legend */}
                <div className="w-full border-t border-brand-border/40 mt-2 pt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-slate-500 font-semibold select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-green border border-green-600" />
                    <span>Occupied (Low Bheed)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-yellow border border-yellow-600" />
                    <span>Occupied (Medium Bheed)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-orange border border-orange-600" />
                    <span>Occupied (High Surge)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-red border border-red-600" />
                    <span>Occupied (Safety Alert)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-600" />
                    <span>Available Seat (Khali Seat)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center text-white text-[8px] font-bold">♿</span>
                    <span>Wheelchair Seat (Disabled Path)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen-reader accessible alternative table */}
            <div className="bg-brand-elevated border border-brand-border p-4 rounded-2xl">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-300 mb-4">
                Zone Telemetry Data Table
              </h2>
              <AccessibleDataTable
                caption="Stadium zones real time congestion occupancy telemetry"
                data={zones}
                columns={zoneColumns}
                keyExtractor={(z) => z.id}
              />
            </div>
            
          </div>

          {/* Right Column: Alerts & Inspection Panels (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Active Incidents Queue */}
            <div className="bg-brand-elevated border border-brand-border p-4 rounded-2xl flex flex-col gap-4">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-300">
                Incident Response Queue ({unresolvedIncidents.length})
              </h2>
              
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {unresolvedIncidents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs italic">
                    All queues clear. No open incidents reported.
                  </div>
                ) : (
                  unresolvedIncidents.map(inc => {
                    const zone = zones.find(z => z.id === inc.zoneId);
                    return (
                      <AlertCard
                        key={inc.id}
                        title={inc.title}
                        description={inc.description}
                        severity={inc.severity}
                        zoneName={zone ? zone.name : undefined}
                        timestamp={inc.timestamp}
                        onClick={() => setSelectedIncidentId(inc.id)}
                        className={selectedIncidentId === inc.id ? 'ring-2 ring-brand-cyan ring-offset-1 bg-slate-200 dark:bg-slate-800' : ''}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Active Detail Inspection Panel */}
            <div className="bg-brand-elevated border border-brand-border p-4 rounded-2xl flex flex-col gap-4">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-300">
                Operations Briefing Detail
              </h2>

              {/* Case 1: Incident Focus Mode */}
              {activeIncident ? (
                <div className="flex flex-col gap-4">
                  <div className="border-b border-brand-border pb-3 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{activeIncident.title}</h3>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1 block">
                        ID: {activeIncident.id} | Reported: {activeIncident.reportedBy}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedIncidentId(null)}
                      className="px-2 py-1 text-[10px] h-auto"
                    >
                      Clear
                    </Button>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-brand-dark/50 p-2.5 rounded-lg border border-brand-border/40">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Grounded Evidence:</span>
                    <p className="italic font-mono text-slate-700 dark:text-slate-300">{activeIncident.evidence}</p>
                  </div>

                  {/* AI Operations Briefing (Grounded explanation) */}
                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-brand-cyan/5 border border-brand-cyan/10 p-3 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-brand-cyan/10 pb-1.5">
                      <span className="font-extrabold text-[10px] text-brand-cyan uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                        AI Operations Brief
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {aiEnabled ? 'Grounded Gemini' : 'Local Fallback Engine'}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeIncident.aiBriefing || 
                        `System Brief: Incident ${activeIncident.id} in zone ${
                          zones.find(z => z.id === activeIncident.zoneId)?.name || 'Unknown'
                        } assessed as severity ${activeIncident.severity}. We recommend deploying local volunteers immediately to assist and executing alternate routing.`}
                    </p>
                  </div>

                  {/* Action Checklist */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">Required Action Checklist:</span>
                    <div className="flex flex-col gap-2">
                      {activeIncident.recommendedActions.map(action => (
                        <label
                          key={action.id}
                          className="flex items-start gap-2.5 p-2 rounded bg-brand-dark/40 hover:bg-brand-dark/80 cursor-pointer transition-colors border border-brand-border/30 text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={action.isCompleted}
                            onChange={() => toggleAction(activeIncident.id, action.id)}
                            className="mt-0.5 w-4 h-4 rounded text-brand-cyan bg-brand-dark border-brand-border focus:ring-brand-cyan cursor-pointer"
                          />
                          <div>
                            <span className={`font-bold block ${action.isCompleted ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                              {action.title}
                            </span>
                            <span className="text-[10px] text-slate-500 leading-relaxed block mt-0.5">
                              {action.description}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) 
              
              /* Case 2: Zone Inspection Mode */
              : activeZone ? (
                <div className="flex flex-col gap-4">
                  <div className="border-b border-brand-border pb-3 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{activeZone.name}</h3>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
                        Zone ID: {activeZone.id}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedZoneId(null)}
                      className="px-2 py-1 text-[10px] h-auto"
                    >
                      Clear
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-brand-dark/40 border border-brand-border/40 p-2.5 rounded-lg">
                      <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Occupancy Ratio</span>
                      <span className="text-base font-black text-slate-200 block mt-0.5 tabular-nums">
                        {((activeZone.currentOccupancy / activeZone.capacity) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-brand-dark/40 border border-brand-border/40 p-2.5 rounded-lg">
                      <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Flow Direction</span>
                      <span className="text-base font-black text-brand-lime block mt-0.5 uppercase tracking-wider">
                        {activeZoneAnalysis?.trend === 'UP' ? '↗ Inflow' : activeZoneAnalysis?.trend === 'DOWN' ? '↘ Outflow' : '→ Stable'}
                      </span>
                    </div>
                  </div>

                  {/* Sparkline trend mockup */}
                  <div className="bg-brand-dark/20 border border-brand-border/40 p-3 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">1-Hour Loading History</span>
                    <div className="flex justify-between items-end gap-1 h-12 mt-3 px-2">
                      {activeZone.trendHistory.map((val, idx) => {
                        const pct = Math.max(10, Math.min(100, (val / activeZone.capacity) * 100));
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <div 
                              className="w-full bg-brand-cyan/20 hover:bg-brand-cyan/40 border border-brand-cyan/35 rounded-t transition-all"
                              style={{ height: `${pct}%` }}
                              title={`Occupancy: ${val}`}
                            />
                            <span className="text-[8px] text-slate-600 font-bold tabular-nums">-{activeZone.trendHistory.length - 1 - idx}0m</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Operational Risk Flags */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-300 text-xs">Flagged Telemetry Risks:</span>
                    {activeZoneAnalysis?.riskFlags.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">No telemetry anomalies flagged for this zone.</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {activeZoneAnalysis?.riskFlags.map(flag => (
                          <span 
                            key={flag} 
                            className="px-2 py-0.5 rounded font-bold text-[9px] bg-status-red/10 border border-status-red/20 text-status-red uppercase tracking-wider"
                          >
                            {flag.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Manual Simulation sliders (For Ground Telemetry verification) */}
                  <div className="border-t border-brand-border/60 pt-4 flex flex-col gap-3">
                    <span className="font-bold text-slate-300 text-xs">Simulate Ground Telemetry:</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <label htmlFor="sim-occupancy-range">Mock Occupancy: {simValue}</label>
                        <span>Max {activeZone.capacity}</span>
                      </div>
                      <input
                        id="sim-occupancy-range"
                        type="range"
                        min="0"
                        max={activeZone.capacity}
                        value={simValue}
                        onChange={(e) => setSimValue(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-cyan focus:outline-none"
                      />
                      <div className="flex gap-2 mt-1">
                        <Button 
                          variant="secondary" 
                          onClick={handleSimulateOccupancy} 
                          className="flex-1 py-1.5 text-xs h-auto"
                        >
                          Push Telemetry
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={handleTriggerIncident} 
                          className="py-1.5 text-xs h-auto"
                          disabled={activeZoneAnalysis?.riskFlags.length === 0}
                        >
                          Trigger Incident
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) 
              
              /* Case 3: No Selection State */
              : (
                <div className="text-center py-16 text-slate-500 text-xs italic flex flex-col items-center gap-2">
                  <span className="text-2xl" role="img" aria-label="Camera magnifying glass">🔍</span>
                  <span>Select a Zone on the map or click an active Incident Card to open detailed operations briefings.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </Shell>
  );
}
