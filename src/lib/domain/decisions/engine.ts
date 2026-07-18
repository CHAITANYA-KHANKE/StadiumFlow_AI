import { Zone, IncidentSeverity, RecommendedAction } from '@/types';

export interface DecisionBrief {
  severity: IncidentSeverity;
  priorityScore: number; // 0 to 100
  escalationRequired: boolean;
  allowedActions: RecommendedAction[];
}

export interface IncidentSignal {
  type: 'CONGESTION' | 'MEDICAL' | 'HAZARD' | 'SECURITY' | 'EQUIPMENT' | 'OTHER';
  description: string;
  isSensorReported: boolean;
}

/**
 * Pure function to assess incident inputs and determine severity, priority, and actions.
 */
export function assessIncident(
  zone: Zone | null,
  signal: IncidentSignal
): DecisionBrief {
  let severity: IncidentSeverity = 'LOW';
  let priorityScore = 10;
  let escalationRequired = false;
  const actions: Omit<RecommendedAction, 'id'>[] = [];

  const ratio = zone && zone.capacity > 0 ? zone.currentOccupancy / zone.capacity : 0;

  // 1. Structural Hazard (highest priority)
  if (signal.type === 'HAZARD') {
    severity = 'CRITICAL';
    priorityScore = 100;
    escalationRequired = true;
    actions.push(
      { title: 'Evacuate Affected Zones', description: 'Safely guide people away from the hazard zone.', isCompleted: false },
      { title: 'Dispatch Structural Engineering Team', description: 'Inspect and secure the physical location.', isCompleted: false },
      { title: 'Close Nearest Entry Gates', description: 'Stop inflow of fans into the affected stand/zone.', isCompleted: false }
    );
  }
  // 2. Medical Emergency
  else if (signal.type === 'MEDICAL') {
    severity = 'CRITICAL';
    priorityScore = 95;
    escalationRequired = true;
    actions.push(
      { title: 'Dispatch Medical First Responders', description: 'Send nearest medical cart to target POI.', isCompleted: false },
      { title: 'Clear Medical Route Lane', description: 'Volunteer staff to clear paths for response vehicle.', isCompleted: false },
      { title: 'Alert On-Site Medical Center', description: 'Prepare base clinic for incoming triage.', isCompleted: false }
    );
  }
  // 3. Severe Over-Capacity / Crowd Crushes
  else if (ratio >= 1.05 && signal.type === 'CONGESTION') {
    severity = 'CRITICAL';
    priorityScore = 90;
    escalationRequired = true;
    actions.push(
      { title: 'Evacuate Concourse', description: 'Clear congestion by opening emergency egress gates.', isCompleted: false },
      { title: 'Close Entry Turnstiles', description: 'Stop all incoming tickets at Gates for this zone.', isCompleted: false },
      { title: 'Broadcast Crowd Warning PA', description: 'Instruct fans to move towards open exits.', isCompleted: false }
    );
  }
  // 4. High Congestion (RED Zone)
  else if (ratio >= 0.9 || (signal.type === 'CONGESTION' && ratio >= 0.85)) {
    severity = 'HIGH';
    priorityScore = 75;
    escalationRequired = true;
    actions.push(
      { title: 'Initiate Crowd Rerouting', description: 'Signal navigation app to bypass this zone.', isCompleted: false },
      { title: 'Open Secondary Egress Gates', description: 'Reduce flow tension at major gates.', isCompleted: false },
      { title: 'Deploy Crowd Marshall Volunteers', description: 'Instruct staff to manage standing crowds.', isCompleted: false }
    );
  }
  // 5. Security incident / Minor fights
  else if (signal.type === 'SECURITY') {
    severity = 'HIGH';
    priorityScore = 80;
    escalationRequired = true;
    actions.push(
      { title: 'Dispatch Stadium Security', description: 'Send response unit to defuse conflict.', isCompleted: false },
      { title: 'Review CCTV Feed', description: 'Pull up cameras covering target zone.', isCompleted: false }
    );
  }
  // 6. Moderate Congestion (ORANGE Zone)
  else if (ratio >= 0.75) {
    severity = 'MEDIUM';
    priorityScore = 50;
    escalationRequired = false;
    actions.push(
      { title: 'Monitor Zone Occupancy', description: 'Check congestion trend every 5 minutes.', isCompleted: false },
      { title: 'Adjust Navigation Path Weight', description: 'Increase cost penalty for routing through this zone.', isCompleted: false }
    );
  }
  // 7. General issues / Lost items / Equipment failures
  else if (signal.type === 'EQUIPMENT') {
    severity = 'LOW';
    priorityScore = 30;
    escalationRequired = false;
    actions.push(
      { title: 'Dispatch Maintenance Crew', description: 'Repair faulty hardware/signage.', isCompleted: false }
    );
  }
  // Default LOW severity
  else {
    severity = 'LOW';
    priorityScore = 15;
    escalationRequired = false;
    actions.push(
      { title: 'File Incident Report', description: 'Log details into the system database.', isCompleted: false }
    );
  }

  // Create unique action IDs
  const allowedActions: RecommendedAction[] = actions.map((act, index) => ({
    id: `ACT_${signal.type}_${index + 1}`,
    ...act
  }));

  return {
    severity,
    priorityScore,
    escalationRequired,
    allowedActions
  };
}
