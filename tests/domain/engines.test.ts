import { describe, it, expect } from 'vitest';
import { calculateCongestionLevel, calculateTrend, analyzeCrowd } from '@/lib/domain/crowd/engine';
import { calculateRoute } from '@/lib/domain/routing/engine';
import { assessIncident } from '@/lib/domain/decisions/engine';
import { Zone, POI, Edge } from '@/types';

describe('Crowd Engine Tests', () => {
  it('should correctly classify congestion levels', () => {
    expect(calculateCongestionLevel(100, 1000)).toBe('GREEN');
    expect(calculateCongestionLevel(500, 1000)).toBe('YELLOW');
    expect(calculateCongestionLevel(750, 1000)).toBe('ORANGE');
    expect(calculateCongestionLevel(900, 1000)).toBe('RED');
    // Edge case: capacity is zero
    expect(calculateCongestionLevel(500, 0)).toBe('GREEN');
  });

  it('should calculate historical occupancy trends correctly', () => {
    expect(calculateTrend([])).toBe('STABLE');
    expect(calculateTrend([100])).toBe('STABLE');
    expect(calculateTrend([100, 120])).toBe('UP');
    expect(calculateTrend([120, 100])).toBe('DOWN');
    expect(calculateTrend([100, 100])).toBe('STABLE');
  });

  it('should analyze crowd metrics and return appropriate risk flags and recommendations', () => {
    const normalZone: Zone = {
      id: 'Z1',
      name: 'Zone 1',
      capacity: 1000,
      currentOccupancy: 300,
      inflow: 50,
      outflow: 50,
      trendHistory: [280, 300]
    };
    
    // Normal case
    const normalAnalysis = analyzeCrowd(normalZone);
    expect(normalAnalysis.congestionLevel).toBe('GREEN');
    expect(normalAnalysis.riskFlags).toHaveLength(0);
    expect(normalAnalysis.trend).toBe('UP');

    // Capacity breach
    const breachZone = { ...normalZone, currentOccupancy: 1100 };
    const breachAnalysis = analyzeCrowd(breachZone);
    expect(breachAnalysis.riskFlags).toContain('CAPACITY_BREACH');
    expect(breachAnalysis.recommendedActionIds).toContain('ACT_STOP_ENTRY');
    expect(breachAnalysis.recommendedActionIds).toContain('ACT_EVACUATE_ZONE');

    // Rapid Inflow
    const rapidZone = { ...normalZone, inflow: 200 }; // 20% of capacity
    const rapidAnalysis = analyzeCrowd(rapidZone);
    expect(rapidAnalysis.riskFlags).toContain('RAPID_INFLOW');
    expect(rapidAnalysis.recommendedActionIds).toContain('ACT_SLOW_ENTRY');

    // Gate specific analysis
    const gateZone = { ...normalZone, currentOccupancy: 860 }; // 86% of capacity
    const gateAnalysis = analyzeCrowd(gateZone, true);
    expect(gateAnalysis.riskFlags).toContain('CRITICAL_GATE_LOAD');
    expect(gateAnalysis.recommendedActionIds).toContain('ACT_OPEN_ALT_GATES');
  });
});

describe('Routing Engine Tests', () => {
  const mockPois: POI[] = [
    { id: 'P_A', name: 'POI A', type: 'GATE', zoneId: 'Z_A', isAccessible: true, isClosed: false },
    { id: 'P_B', name: 'POI B', type: 'STAND', zoneId: 'Z_B', isAccessible: true, isClosed: false },
    { id: 'P_C', name: 'POI C', type: 'STAND', zoneId: 'Z_C', isAccessible: false, isClosed: false }, // stairs only
    { id: 'P_D', name: 'POI D', type: 'EXIT', zoneId: 'Z_D', isAccessible: true, isClosed: false },
    { id: 'P_CLOSED', name: 'POI Closed', type: 'STAND', zoneId: 'Z_D', isAccessible: true, isClosed: true },
    { id: 'P_INACCESSIBLE', name: 'POI Inaccessible', type: 'STAND', zoneId: 'Z_D', isAccessible: false, isClosed: false },
    { id: 'P_ISLAND', name: 'POI Island', type: 'STAND', zoneId: 'Z_D', isAccessible: true, isClosed: false }
  ];

  const mockEdges: Edge[] = [
    { source: 'P_A', target: 'P_B', distance: 10, isAccessible: true, isClosed: false },
    { source: 'P_B', target: 'P_D', distance: 10, isAccessible: true, isClosed: false },
    { source: 'P_A', target: 'P_C', distance: 5, isAccessible: false, isClosed: false },
    { source: 'P_C', target: 'P_D', distance: 5, isAccessible: false, isClosed: false },
    { source: 'P_A', target: 'P_CLOSED', distance: 10, isAccessible: true, isClosed: false }
  ];

  const mockZones: Zone[] = [
    { id: 'Z_A', name: 'Zone A', capacity: 100, currentOccupancy: 10, inflow: 0, outflow: 0, trendHistory: [] },
    { id: 'Z_B', name: 'Zone B', capacity: 100, currentOccupancy: 10, inflow: 0, outflow: 0, trendHistory: [] },
    { id: 'Z_C', name: 'Zone C', capacity: 100, currentOccupancy: 10, inflow: 0, outflow: 0, trendHistory: [] },
    { id: 'Z_D', name: 'Zone D', capacity: 100, currentOccupancy: 10, inflow: 0, outflow: 0, trendHistory: [] }
  ];

  it('should find the absolute shortest route under normal conditions', () => {
    // Normal route from A to D should take A -> C -> D (distance 10) because it's shorter than A -> B -> D (distance 20)
    const route = calculateRoute(mockPois, mockEdges, mockZones, 'P_A', 'P_D');
    expect(route).not.toBeNull();
    expect(route!.path).toEqual(['P_A', 'P_C', 'P_D']);
    expect(route!.totalDistance).toBe(10);
  });

  it('should avoid inaccessible edges when accessible mode is active', () => {
    // Under accessibility constraint, stairs (A -> C -> D) are avoided, should take A -> B -> D (distance 20)
    const route = calculateRoute(mockPois, mockEdges, mockZones, 'P_A', 'P_D', { requireAccessible: true });
    expect(route).not.toBeNull();
    expect(route!.path).toEqual(['P_A', 'P_B', 'P_D']);
    expect(route!.totalDistance).toBe(20);
    expect(route!.isAccessible).toBe(true);
  });

  it('should detour around highly congested zones', () => {
    // Simulate high congestion in Zone C (95% occupancy)
    const congestedZones = mockZones.map(z => 
      z.id === 'Z_C' ? { ...z, currentOccupancy: 95 } : z
    );
    
    // When avoiding congested paths, the engine should prefer A -> B -> D (distance 20)
    // instead of the congested A -> C -> D (cost is 10 + penalties)
    const route = calculateRoute(mockPois, mockEdges, congestedZones, 'P_A', 'P_D', { avoidCongested: true });
    expect(route).not.toBeNull();
    expect(route!.path).toEqual(['P_A', 'P_B', 'P_D']);
    expect(route!.totalDistance).toBe(20);
  });

  it('should respect closures of edges and nodes', () => {
    // Close edge B -> D
    const closedEdges = mockEdges.map(e => 
      e.source === 'P_B' && e.target === 'P_D' ? { ...e, isClosed: true } : e
    );
    
    // Only accessible route from A to D was A -> B -> D. Since B -> D is closed, accessible route is impossible
    const route = calculateRoute(mockPois, closedEdges, mockZones, 'P_A', 'P_D', { requireAccessible: true });
    expect(route).toBeNull();
  });

  it('should return null for invalid inputs or closed endpoints', () => {
    // Non-existent nodes
    expect(calculateRoute(mockPois, mockEdges, mockZones, 'P_A', 'P_INVALID')).toBeNull();
    expect(calculateRoute(mockPois, mockEdges, mockZones, 'P_INVALID', 'P_D')).toBeNull();
    
    // Closed endpoint
    expect(calculateRoute(mockPois, mockEdges, mockZones, 'P_A', 'P_CLOSED')).toBeNull();

    // Accessible check on inaccessible start/end node
    expect(calculateRoute(mockPois, mockEdges, mockZones, 'P_A', 'P_INACCESSIBLE', { requireAccessible: true })).toBeNull();

    // Destination is completely unreachable
    expect(calculateRoute(mockPois, mockEdges, mockZones, 'P_A', 'P_ISLAND')).toBeNull();
  });
});

describe('Decision Engine Tests', () => {
  const mockZone: Zone = {
    id: 'Z1',
    name: 'Zone 1',
    capacity: 1000,
    currentOccupancy: 500,
    inflow: 0,
    outflow: 0,
    trendHistory: []
  };

  it('should flag hazards and medical emergencies as critical severity', () => {
    const hazardBrief = assessIncident(mockZone, { type: 'HAZARD', description: 'Fire alarm stand A', isSensorReported: true });
    expect(hazardBrief.severity).toBe('CRITICAL');
    expect(hazardBrief.priorityScore).toBe(100);
    expect(hazardBrief.escalationRequired).toBe(true);
    expect(hazardBrief.allowedActions.map(a => a.title)).toContain('Evacuate Affected Zones');

    const medicalBrief = assessIncident(mockZone, { type: 'MEDICAL', description: 'Chest pain row 4', isSensorReported: false });
    expect(medicalBrief.severity).toBe('CRITICAL');
    expect(medicalBrief.priorityScore).toBe(95);
    expect(medicalBrief.escalationRequired).toBe(true);
    expect(medicalBrief.allowedActions.map(a => a.title)).toContain('Dispatch Medical First Responders');
  });

  it('should determine severity based on zone capacity triggers', () => {
    // Over capacity trigger
    const fullZone = { ...mockZone, currentOccupancy: 1100 };
    const congestionBrief = assessIncident(fullZone, { type: 'CONGESTION', description: 'Gate block', isSensorReported: true });
    expect(congestionBrief.severity).toBe('CRITICAL');
    expect(congestionBrief.priorityScore).toBe(90);

    // High congestion (91% capacity)
    const highZone = { ...mockZone, currentOccupancy: 910 };
    const highBrief = assessIncident(highZone, { type: 'CONGESTION', description: 'Heavy queueing', isSensorReported: true });
    expect(highBrief.severity).toBe('HIGH');
    expect(highBrief.priorityScore).toBe(75);

    // Moderate congestion (80% capacity)
    const modZone = { ...mockZone, currentOccupancy: 800 };
    const modBrief = assessIncident(modZone, { type: 'CONGESTION', description: 'Moderate crowd', isSensorReported: false });
    expect(modBrief.severity).toBe('MEDIUM');
    expect(modBrief.priorityScore).toBe(50);
  });

  it('should evaluate security, equipment, and general incident signals', () => {
    // Security incident
    const securityBrief = assessIncident(mockZone, { type: 'SECURITY', description: 'Intruder on pitch', isSensorReported: false });
    expect(securityBrief.severity).toBe('HIGH');
    expect(securityBrief.priorityScore).toBe(80);
    expect(securityBrief.escalationRequired).toBe(true);
    expect(securityBrief.allowedActions.map(a => a.title)).toContain('Dispatch Stadium Security');

    // Equipment issue
    const equipBrief = assessIncident(mockZone, { type: 'EQUIPMENT', description: 'Camera 4 offline', isSensorReported: true });
    expect(equipBrief.severity).toBe('LOW');
    expect(equipBrief.priorityScore).toBe(30);
    expect(equipBrief.allowedActions.map(a => a.title)).toContain('Dispatch Maintenance Crew');

    // Default case (OTHER)
    const defaultBrief = assessIncident(mockZone, { type: 'OTHER', description: 'General query', isSensorReported: false });
    expect(defaultBrief.severity).toBe('LOW');
    expect(defaultBrief.priorityScore).toBe(15);
    expect(defaultBrief.allowedActions.map(a => a.title)).toContain('File Incident Report');
  });
});
