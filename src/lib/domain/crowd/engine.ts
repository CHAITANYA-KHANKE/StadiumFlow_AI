import { CongestionLevel, Zone } from '@/types';

export interface CrowdAnalysisResult {
  occupancyRatio: number;
  congestionLevel: CongestionLevel;
  trend: 'UP' | 'DOWN' | 'STABLE';
  riskFlags: string[];
  recommendedActionIds: string[];
}

/**
 * Calculates congestion level based on current occupancy and capacity.
 */
export function calculateCongestionLevel(occupancy: number, capacity: number): CongestionLevel {
  if (capacity <= 0) return 'GREEN';
  const ratio = occupancy / capacity;
  if (ratio >= 0.9) return 'RED';
  if (ratio >= 0.75) return 'ORANGE';
  if (ratio >= 0.5) return 'YELLOW';
  return 'GREEN';
}

/**
 * Calculates trend based on historical data.
 */
export function calculateTrend(trendHistory: number[]): 'UP' | 'DOWN' | 'STABLE' {
  if (trendHistory.length < 2) return 'STABLE';
  const len = trendHistory.length;
  const recent = trendHistory[len - 1];
  const previous = trendHistory[len - 2];
  
  if (recent > previous) return 'UP';
  if (recent < previous) return 'DOWN';
  return 'STABLE';
}

/**
 * Analyzes a zone's metrics and returns safety risk flags and recommendations.
 */
export function analyzeCrowd(
  zone: Zone,
  isGateZone: boolean = false
): CrowdAnalysisResult {
  const { capacity, currentOccupancy, inflow, trendHistory } = zone;
  
  const occupancyRatio = capacity > 0 ? currentOccupancy / capacity : 0;
  const congestionLevel = calculateCongestionLevel(currentOccupancy, capacity);
  const trend = calculateTrend(trendHistory);
  
  const riskFlags: string[] = [];
  const recommendedActionIds: string[] = [];
  
  // 1. Capacity Breach Flag
  if (currentOccupancy > capacity) {
    riskFlags.push('CAPACITY_BREACH');
    recommendedActionIds.push('ACT_STOP_ENTRY', 'ACT_EVACUATE_ZONE');
  }
  
  // 2. High Congestion Flag
  if (congestionLevel === 'RED') {
    riskFlags.push('HIGH_CONGESTION');
    if (!recommendedActionIds.includes('ACT_STOP_ENTRY')) {
      recommendedActionIds.push('ACT_REDIRECT_FLOW', 'ACT_OPEN_EXITS');
    }
  } else if (congestionLevel === 'ORANGE') {
    riskFlags.push('MODERATE_CONGESTION');
    recommendedActionIds.push('ACT_REDIRECT_FLOW');
  }
  
  // 3. Rapid Inflow Flag (inflow exceeds 15% of total capacity)
  if (capacity > 0 && inflow > capacity * 0.15) {
    riskFlags.push('RAPID_INFLOW');
    recommendedActionIds.push('ACT_SLOW_ENTRY', 'ACT_DEPLOY_VOLUNTEERS');
  }
  
  // 4. Critical Gate Load Flag
  if (isGateZone && occupancyRatio >= 0.85) {
    riskFlags.push('CRITICAL_GATE_LOAD');
    if (!recommendedActionIds.includes('ACT_DEPLOY_VOLUNTEERS')) {
      recommendedActionIds.push('ACT_DEPLOY_VOLUNTEERS');
    }
    recommendedActionIds.push('ACT_OPEN_ALT_GATES');
  }
  
  return {
    occupancyRatio,
    congestionLevel,
    trend,
    riskFlags,
    recommendedActionIds: Array.from(new Set(recommendedActionIds)) // Deduplicate actions
  };
}
