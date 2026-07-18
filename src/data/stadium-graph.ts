import { Zone, POI, Edge, Incident, StadiumData } from '@/types';

export const INITIAL_ZONES: Zone[] = [
  {
    id: 'ZONE_GATE_A',
    name: 'Gate A Entrance Area',
    capacity: 2000,
    currentOccupancy: 800,
    inflow: 250,
    outflow: 100,
    trendHistory: [500, 600, 700, 800]
  },
  {
    id: 'ZONE_GATE_B',
    name: 'Gate B Entrance Area',
    capacity: 1500,
    currentOccupancy: 1400, // HIGH Congestion (YELLOW/RED)
    inflow: 400, // Rapid Inflow
    outflow: 50,
    trendHistory: [900, 1100, 1300, 1400]
  },
  {
    id: 'ZONE_CONCOURSE_N',
    name: 'North Concourse',
    capacity: 4000,
    currentOccupancy: 1200,
    inflow: 150,
    outflow: 150,
    trendHistory: [1000, 1100, 1150, 1200]
  },
  {
    id: 'ZONE_CONCOURSE_S',
    name: 'South Concourse',
    capacity: 3500,
    currentOccupancy: 3300, // Very High Congestion (ORANGE/RED)
    inflow: 300,
    outflow: 100,
    trendHistory: [2500, 2900, 3100, 3300]
  },
  {
    id: 'ZONE_STAND_100',
    name: 'Lower Stand East',
    capacity: 3000,
    currentOccupancy: 2100,
    inflow: 200,
    outflow: 50,
    trendHistory: [1800, 1900, 2000, 2100]
  },
  {
    id: 'ZONE_STAND_200',
    name: 'Upper Stand East',
    capacity: 2500,
    currentOccupancy: 1000,
    inflow: 80,
    outflow: 80,
    trendHistory: [900, 950, 1000, 1000]
  },
  {
    id: 'ZONE_VIP',
    name: 'VIP Club Lounge',
    capacity: 500,
    currentOccupancy: 480, // High occupancy ratio
    inflow: 30,
    outflow: 10,
    trendHistory: [400, 430, 460, 480]
  },
  {
    id: 'ZONE_TRANSIT',
    name: 'Transit Plaza Hub',
    capacity: 5000,
    currentOccupancy: 1500,
    inflow: 200,
    outflow: 400,
    trendHistory: [2000, 1800, 1600, 1500]
  }
];

export const INITIAL_POIS: POI[] = [
  { id: 'POI_GATE_A', name: 'Gate A (Main Entry)', type: 'GATE', zoneId: 'ZONE_GATE_A', isAccessible: true, isClosed: false },
  { id: 'POI_GATE_B', name: 'Gate B (North Entry - Stairs)', type: 'GATE', zoneId: 'ZONE_GATE_B', isAccessible: false, isClosed: false },
  { id: 'POI_CONCOURSE_N', name: 'North Concourse Link', type: 'STAND', zoneId: 'ZONE_CONCOURSE_N', isAccessible: true, isClosed: false },
  { id: 'POI_CONCOURSE_S', name: 'South Concourse Link', type: 'STAND', zoneId: 'ZONE_CONCOURSE_S', isAccessible: true, isClosed: false },
  { id: 'POI_STAND_101', name: 'Section 101 (Lower Stand)', type: 'STAND', zoneId: 'ZONE_STAND_100', isAccessible: true, isClosed: false },
  { id: 'POI_STAND_201', name: 'Section 201 (Upper Stand - Stairs Only)', type: 'STAND', zoneId: 'ZONE_STAND_200', isAccessible: false, isClosed: false },
  { id: 'POI_RESTROOM_N', name: 'Restroom Block North', type: 'RESTROOM', zoneId: 'ZONE_CONCOURSE_N', isAccessible: true, isClosed: false },
  { id: 'POI_RESTROOM_S', name: 'Restroom Block South', type: 'RESTROOM', zoneId: 'ZONE_CONCOURSE_S', isAccessible: true, isClosed: false },
  { id: 'POI_FOOD_E', name: 'East Food Court', type: 'FOOD', zoneId: 'ZONE_STAND_100', isAccessible: true, isClosed: false },
  { id: 'POI_MEDICAL_E', name: 'First Aid Station East', type: 'MEDICAL', zoneId: 'ZONE_STAND_100', isAccessible: true, isClosed: false },
  { id: 'POI_EXIT_E', name: 'East Emergency Gate Exit', type: 'EXIT', zoneId: 'ZONE_STAND_100', isAccessible: true, isClosed: false },
  { id: 'POI_TRANSIT_HUB', name: 'Metro & Shuttle Bus Plaza', type: 'TRANSIT', zoneId: 'ZONE_TRANSIT', isAccessible: true, isClosed: false }
];

export const INITIAL_EDGES: Edge[] = [
  { source: 'POI_GATE_A', target: 'POI_CONCOURSE_N', distance: 60, isAccessible: true, isClosed: false },
  { source: 'POI_GATE_B', target: 'POI_CONCOURSE_S', distance: 50, isAccessible: false, isClosed: false }, // Stairs only edge
  { source: 'POI_CONCOURSE_N', target: 'POI_RESTROOM_N', distance: 25, isAccessible: true, isClosed: false },
  { source: 'POI_CONCOURSE_N', target: 'POI_STAND_101', distance: 40, isAccessible: true, isClosed: false },
  { source: 'POI_CONCOURSE_N', target: 'POI_STAND_201', distance: 80, isAccessible: false, isClosed: false }, // Stairs only edge
  { source: 'POI_CONCOURSE_N', target: 'POI_FOOD_E', distance: 75, isAccessible: true, isClosed: false },
  
  { source: 'POI_CONCOURSE_S', target: 'POI_STAND_101', distance: 45, isAccessible: true, isClosed: false },
  { source: 'POI_CONCOURSE_S', target: 'POI_RESTROOM_S', distance: 30, isAccessible: true, isClosed: false },
  { source: 'POI_CONCOURSE_S', target: 'POI_MEDICAL_E', distance: 50, isAccessible: true, isClosed: false },
  
  { source: 'POI_STAND_101', target: 'POI_STAND_201', distance: 55, isAccessible: false, isClosed: false }, // Stairs
  { source: 'POI_FOOD_E', target: 'POI_EXIT_E', distance: 35, isAccessible: true, isClosed: false },
  { source: 'POI_MEDICAL_E', target: 'POI_EXIT_E', distance: 30, isAccessible: true, isClosed: false },
  
  { source: 'POI_GATE_A', target: 'POI_TRANSIT_HUB', distance: 110, isAccessible: true, isClosed: false },
  { source: 'POI_GATE_B', target: 'POI_TRANSIT_HUB', distance: 95, isAccessible: true, isClosed: false }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC_001',
    title: 'Gate B Inflow Bottleneck',
    description: 'Gate B is experiencing high congestion and rapid fan arrival rates, leading to long queues outside turnstiles.',
    zoneId: 'ZONE_GATE_B',
    severity: 'HIGH',
    status: 'OPEN',
    timestamp: new Date().toISOString(),
    reportedBy: 'System Sensor G2',
    evidence: 'Inflow rate: 400 fans/10min. Zone Occupancy: 93%.',
    recommendedActions: [
      { id: 'ACT_C_1', title: 'Open Alternate Gates', description: 'Redirect incoming fans to Gate A.', isCompleted: false },
      { id: 'ACT_C_2', title: 'Deploy Crowd Marshall Volunteers', description: 'Direct queue organization outside Gate B.', isCompleted: false }
    ],
    aiBriefing: 'AI Briefing: Gate B entrance is currently overloaded with a 93% occupancy ratio. We recommend immediately broadcasting a navigation detour to Gate A and activating volunteers to organize the queue lines.'
  },
  {
    id: 'INC_002',
    title: 'Medical Dispatch lower Stand East',
    description: 'Fan reports a slip-and-fall injury in Section 101 with mild bleeding.',
    zoneId: 'ZONE_STAND_100',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    reportedBy: 'Volunteer #1042',
    evidence: 'Verbal call on Radio Channel 3. Location: Section 101 Row 12.',
    recommendedActions: [
      { id: 'ACT_M_1', title: 'Dispatch Medical First Responders', description: 'Send Cart 2 to Section 101.', isCompleted: true },
      { id: 'ACT_M_2', title: 'Clear Medical Route Lane', description: 'Instruct sector marshals to clear main aisle.', isCompleted: false }
    ]
  }
];

export const mockStadiumData: StadiumData = {
  zones: INITIAL_ZONES,
  pois: INITIAL_POIS,
  edges: INITIAL_EDGES,
  incidents: INITIAL_INCIDENTS
};
