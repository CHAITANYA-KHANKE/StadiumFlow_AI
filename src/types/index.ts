export type CongestionLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
export type POIType = 'GATE' | 'STAND' | 'RESTROOM' | 'MEDICAL' | 'FOOD' | 'EXIT' | 'TRANSIT';

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  inflow: number;
  outflow: number;
  trendHistory: number[]; // past hourly/10-min occupancy counts
}

export interface POI {
  id: string;
  name: string;
  type: POIType;
  zoneId: string;
  isAccessible: boolean; // step-free, wheelchair-friendly
  isClosed: boolean;
}

export interface Edge {
  source: string; // POI ID
  target: string; // POI ID
  distance: number; // in meters
  isAccessible: boolean;
  isClosed: boolean;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  zoneId: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  timestamp: string;
  reportedBy: string;
  evidence: string; // Ground truth sensor value or message
  recommendedActions: RecommendedAction[];
  aiBriefing?: string; // AI generated brief, if loaded
}

export interface RouteResult {
  path: string[]; // List of POI IDs in traversal order
  totalDistance: number; // total meters
  etaMinutes: number;
  isAccessible: boolean;
  costExplain: {
    baseDistance: number;
    congestionPenalty: number;
    accessibilityFilter: boolean;
  };
}

export interface StadiumData {
  zones: Zone[];
  pois: POI[];
  edges: Edge[];
  incidents: Incident[];
}
