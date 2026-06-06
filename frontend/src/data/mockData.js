export const mockIncidents = [
  { id: 1, type: 'Medical', description: 'Patient unresponsive', lat: 6.5244, lng: 3.3792, severity: 5, priority_score: 9.2, lga: 'Ikeja', status: 'active' },
  { id: 2, type: 'Fire', description: 'Building on fire', lat: 6.4531, lng: 3.3958, severity: 4, priority_score: 8.5, lga: 'Lagos Island', status: 'active' },
  { id: 3, type: 'Security', description: 'Armed robbery in progress', lat: 6.5000, lng: 3.3500, severity: 5, priority_score: 9.8, lga: 'Surulere', status: 'active' },
  { id: 4, type: 'Accident', description: 'Two cars collided on bridge', lat: 6.4500, lng: 3.4000, severity: 3, priority_score: 6.0, lga: 'Eti-Osa', status: 'active' },
  { id: 5, type: 'Medical', description: 'Asthma attack', lat: 6.5500, lng: 3.3500, severity: 3, priority_score: 5.5, lga: 'Mushin', status: 'active' }
];

export const mockHospitals = [
  { id: 1, name: 'Lagos State University Teaching Hospital', lat: 6.5888, lng: 3.3387, capacity: 85, specialisation: 'General' },
  { id: 2, name: 'General Hospital, Lagos', lat: 6.4520, lng: 3.3980, capacity: 60, specialisation: 'General' },
  { id: 3, name: 'Mainland Hospital Yaba', lat: 6.5100, lng: 3.3700, capacity: 40, specialisation: 'Infectious' },
  { id: 4, name: 'National Orthopaedic Hospital', lat: 6.5400, lng: 3.3600, capacity: 70, specialisation: 'Trauma' },
  { id: 5, name: 'Gbagada General Hospital', lat: 6.5500, lng: 3.3800, capacity: 55, specialisation: 'General' }
];

export const mockResponders = [
  { id: 1, name: 'Ambulance 01', lat: 6.5300, lng: 3.3800, status: 'available', lga: 'Ikeja' },
  { id: 2, name: 'Fire Engine 04', lat: 6.4600, lng: 3.4000, status: 'available', lga: 'Lagos Island' },
  { id: 3, name: 'Police Patrol Unit A', lat: 6.5100, lng: 3.3600, status: 'busy', lga: 'Surulere' }
];

export const mockHeatmap = [
  { lga: 'Ikeja', count: 14 },
  { lga: 'Lagos Island', count: 8 },
  { lga: 'Surulere', count: 12 },
  { lga: 'Eti-Osa', count: 5 },
  { lga: 'Mushin', count: 9 },
  { lga: 'Alimosho', count: 18 }
];

export const mockForecast = [
  { hour: '1:00 PM', medical: 3, fire: 1, security: 2, accident: 1 },
  { hour: '2:00 PM', medical: 4, fire: 0, security: 1, accident: 2 },
  { hour: '3:00 PM', medical: 2, fire: 1, security: 3, accident: 1 },
  { hour: '4:00 PM', medical: 5, fire: 0, security: 2, accident: 3 },
  { hour: '5:00 PM', medical: 8, fire: 2, security: 4, accident: 5 },
  { hour: '6:00 PM', medical: 7, fire: 1, security: 3, accident: 4 }
];
