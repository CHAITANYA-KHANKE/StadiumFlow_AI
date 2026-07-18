import { POI, Edge, Zone, RouteResult, CongestionLevel } from '@/types';
import { calculateCongestionLevel } from '../crowd/engine';

export interface RouteOptions {
  requireAccessible?: boolean;
  avoidCongested?: boolean;
}

/**
 * Deterministic Dijkstra-based routing engine for the stadium.
 */
export function calculateRoute(
  pois: POI[],
  edges: Edge[],
  zones: Zone[],
  startPoiId: string,
  endPoiId: string,
  options: RouteOptions = {}
): RouteResult | null {
  const { requireAccessible = false, avoidCongested = false } = options;

  // 1. Check if start/end POIs exist and are valid
  const startPoi = pois.find(p => p.id === startPoiId);
  const endPoi = pois.find(p => p.id === endPoiId);
  if (!startPoi || !endPoi) return null;

  // If destination or origin is closed, no path is allowed unless they are the same
  if (startPoiId !== endPoiId && (startPoi.isClosed || endPoi.isClosed)) {
    return null;
  }

  // If accessible route is requested, but start/end is not accessible, no path is allowed
  if (requireAccessible && (!startPoi.isAccessible || !endPoi.isAccessible)) {
    return null;
  }

  // 2. Setup graph structure
  // Build adjacency list for efficient neighbor lookup
  const graph: { [nodeId: string]: { edge: Edge; targetId: string }[] } = {};
  pois.forEach(p => {
    graph[p.id] = [];
  });

  edges.forEach(edge => {
    // Edges are bidirectional in the stadium layout unless specified, let's treat them as bidirectional
    if (graph[edge.source]) {
      graph[edge.source].push({ edge, targetId: edge.target });
    }
    if (graph[edge.target]) {
      graph[edge.target].push({ edge, targetId: edge.source });
    }
  });

  // 3. Dijkstra's Algorithm
  const distances: { [nodeId: string]: number } = {};
  const previous: { [nodeId: string]: string | null } = {};
  const unvisited = new Set<string>();

  pois.forEach(p => {
    distances[p.id] = Infinity;
    previous[p.id] = null;
    unvisited.add(p.id);
  });

  distances[startPoiId] = 0;

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentId = nodeId;
      }
    });

    if (currentId === null || currentId === endPoiId) {
      break;
    }

    unvisited.delete(currentId);

    // Update distances of neighbors
    const neighbors = graph[currentId] || [];
    for (const { edge, targetId } of neighbors) {
      if (!unvisited.has(targetId)) continue;

      const targetPoi = pois.find(p => p.id === targetId);
      if (!targetPoi) continue;

      // Filter: Skip closed edges or closed POIs
      if (edge.isClosed || targetPoi.isClosed) continue;

      // Filter: Skip inaccessible edges or POIs if accessible route is required
      if (requireAccessible && (!edge.isAccessible || !targetPoi.isAccessible)) {
        continue;
      }

      // Calculate traversal cost (distance + congestion penalty)
      let penaltyMultiplier = 1.0;
      let congestionBand: CongestionLevel = 'GREEN';

      if (avoidCongested) {
        // Find zone of target POI
        const targetZone = zones.find(z => z.id === targetPoi.zoneId);
        if (targetZone) {
          congestionBand = calculateCongestionLevel(
            targetZone.currentOccupancy,
            targetZone.capacity
          );
          
          switch (congestionBand) {
            case 'RED':
              penaltyMultiplier = 4.0;
              break;
            case 'ORANGE':
              penaltyMultiplier = 2.0;
              break;
            case 'YELLOW':
              penaltyMultiplier = 1.3;
              break;
            default:
              penaltyMultiplier = 1.0;
          }
        }
      }

      const cost = edge.distance * penaltyMultiplier;
      const totalCost = distances[currentId] + cost;

      if (totalCost < distances[targetId]) {
        distances[targetId] = totalCost;
        previous[targetId] = currentId;
      }
    }
  }

  // 4. Reconstruct path
  if (distances[endPoiId] === Infinity) {
    return null; // Destination unreachable
  }

  const path: string[] = [];
  let curr: string | null = endPoiId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  // 5. Calculate physical metrics (actual distance travelled without penalty multipliers)
  let totalDistance = 0;
  let totalCongestionCost = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];
    
    // Find the original edge distance
    const connectedEdge = edges.find(
      e => (e.source === u && e.target === v) || (e.source === v && e.target === u)
    );
    
    const edgeDist = connectedEdge ? connectedEdge.distance : 0;
    totalDistance += edgeDist;
    
    // Calculate congestion cost component
    const nextPoi = pois.find(p => p.id === v);
    if (nextPoi) {
      const nextZone = zones.find(z => z.id === nextPoi.zoneId);
      if (nextZone && avoidCongested) {
        const band = calculateCongestionLevel(nextZone.currentOccupancy, nextZone.capacity);
        let multiplier = 1.0;
        if (band === 'RED') multiplier = 4.0;
        else if (band === 'ORANGE') multiplier = 2.0;
        else if (band === 'YELLOW') multiplier = 1.3;
        
        totalCongestionCost += edgeDist * (multiplier - 1.0);
      }
    }
  }

  // Walking speed: standard is 1.2 meters per second (~72 meters/minute)
  // Congestion slows down walking. Let's calculate ETA in minutes.
  // Effective walking speed = 1.2 m/s / penaltyMultiplier
  const baseWalkingSpeedMps = 1.2;
  let totalSeconds = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];
    const connectedEdge = edges.find(
      e => (e.source === u && e.target === v) || (e.source === v && e.target === u)
    );
    const edgeDist = connectedEdge ? connectedEdge.distance : 0;
    
    const targetPoi = pois.find(p => p.id === v);
    const targetZone = targetPoi ? zones.find(z => z.id === targetPoi.zoneId) : null;
    let localMultiplier = 1.0;
    if (targetZone) {
      const band = calculateCongestionLevel(targetZone.currentOccupancy, targetZone.capacity);
      if (band === 'RED') localMultiplier = 4.0;
      else if (band === 'ORANGE') localMultiplier = 2.0;
      else if (band === 'YELLOW') localMultiplier = 1.3;
    }
    
    const effectiveSpeed = baseWalkingSpeedMps / localMultiplier;
    totalSeconds += edgeDist / effectiveSpeed;
  }
  
  const etaMinutes = Math.max(1, Math.round(totalSeconds / 60));

  return {
    path,
    totalDistance,
    etaMinutes,
    isAccessible: path.every(nodeId => {
      const poi = pois.find(p => p.id === nodeId);
      return poi ? poi.isAccessible : false;
    }),
    costExplain: {
      baseDistance: totalDistance,
      congestionPenalty: Math.round(totalCongestionCost),
      accessibilityFilter: requireAccessible
    }
  };
}
