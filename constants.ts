import { Band, FrequencyBandDef, FrequencyTerm, Zone } from "./types";

export const FREQ_MIN = 20;
export const FREQ_MAX = 20000;

export const BANDS: FrequencyBandDef[] = [
  { label: Band.SubBass, minHz: 20, maxHz: 60, color: 'bg-cyan-500' },
  { label: Band.Bass, minHz: 60, maxHz: 250, color: 'bg-cyan-400' },
  { label: Band.LowMids, minHz: 250, maxHz: 500, color: 'bg-cyan-300' },
  { label: Band.Mids, minHz: 500, maxHz: 2000, color: 'bg-cyan-200' },
  { label: Band.UpperMids, minHz: 2000, maxHz: 4000, color: 'bg-cyan-100' },
  { label: Band.Highs, minHz: 4000, maxHz: 20000, color: 'bg-cyan-50' },
];

export const FREQUENCY_TERMS: FrequencyTerm[] = [
  // TOO MUCH (Red/Pink)
  { id: 'rumble', label: 'Rumble', zone: Zone.TooMuch, minHz: 20, maxHz: 60, description: 'Low frequency noise, often from HVAC or handling noise.' },
  { id: 'boomy', label: 'Boomy', zone: Zone.TooMuch, minHz: 80, maxHz: 200, description: 'Overwhelming low-end resonance that lacks definition.' },
  { id: 'muddy', label: 'Muddy', zone: Zone.TooMuch, minHz: 200, maxHz: 400, description: 'Lack of clarity due to congestion in the low-mids.' },
  { id: 'boxy', label: 'Boxy', zone: Zone.TooMuch, minHz: 300, maxHz: 600, description: 'Sounds like the audio is trapped in a small cardboard box.' },
  { id: 'honky', label: 'Honky/Nasaly', zone: Zone.TooMuch, minHz: 600, maxHz: 1200, description: 'Resonant, nasal quality often found in vocals or cheap microphones.' },
  { id: 'tinny', label: 'Tinny', zone: Zone.TooMuch, minHz: 1000, maxHz: 2000, description: 'Thin, metallic sound lacking body.' },
  { id: 'too_much_char', label: 'Too Much Character', zone: Zone.TooMuch, minHz: 1500, maxHz: 3000, description: 'Over-aggressive midrange presence.' },
  { id: 'harsh', label: 'Harsh', zone: Zone.TooMuch, minHz: 2000, maxHz: 5000, description: 'Painful, grating frequencies that cause ear fatigue.' },
  { id: 'sibilance', label: 'Sibilance', zone: Zone.TooMuch, minHz: 4000, maxHz: 8000, description: 'Sharp "S" and "T" sounds in vocals.' },
  { id: 'too_far_forward', label: 'Too Far Forward', zone: Zone.TooMuch, minHz: 3000, maxHz: 6000, description: 'The sound sits uncomfortably close to the listener.' },
  { id: 'piercing', label: 'Piercing', zone: Zone.TooMuch, minHz: 8000, maxHz: 12000, description: 'Sharp high frequencies that hurt the ears.' },
  { id: 'brittle', label: 'Brittle', zone: Zone.TooMuch, minHz: 10000, maxHz: 20000, description: 'Fragile, breaking-glass quality in the high end.' },

  // BALANCED (Green)
  { id: 'bottom', label: 'Bottom', zone: Zone.Balanced, minHz: 20, maxHz: 100, description: 'Solid foundation and weight in the low end.' },
  { id: 'punch', label: 'Punch', zone: Zone.Balanced, minHz: 100, maxHz: 200, description: 'Impact and physical feeling of the sound.' },
  { id: 'warm', label: 'Warm', zone: Zone.Balanced, minHz: 200, maxHz: 500, description: 'Pleasant richness and fullness.' },
  { id: 'clear', label: 'Clear', zone: Zone.Balanced, minHz: 250, maxHz: 600, description: 'Lack of mud, allowing the sound to be heard distinctly.' },
  { id: 'full', label: 'Full', zone: Zone.Balanced, minHz: 400, maxHz: 800, description: 'Complete representation of the sound\'s body.' },
  { id: 'edge', label: 'Edge', zone: Zone.Balanced, minHz: 1500, maxHz: 3000, description: 'Attitude and bite that helps cut through a mix.' },
  { id: 'definition', label: 'Definition', zone: Zone.Balanced, minHz: 2000, maxHz: 5000, description: 'The ability to distinguish the specific character of a sound.' },
  { id: 'present', label: 'Present', zone: Zone.Balanced, minHz: 3000, maxHz: 6000, description: 'Closeness and intimacy.' },
  { id: 'bright', label: 'Bright', zone: Zone.Balanced, minHz: 6000, maxHz: 16000, description: 'Lively high-end energy.' },
  { id: 'air', label: 'Air', zone: Zone.Balanced, minHz: 10000, maxHz: 20000, description: 'Openness and space at the very top of the spectrum.' },

  // TOO LITTLE (Red/Pink)
  { id: 'weak', label: 'Weak', zone: Zone.TooLittle, minHz: 20, maxHz: 80, description: 'Lacking power and foundation.' },
  { id: 'thin', label: 'Thin', zone: Zone.TooLittle, minHz: 80, maxHz: 300, description: 'Lacking body and weight.' },
  { id: 'hollow', label: 'Hollow', zone: Zone.TooLittle, minHz: 300, maxHz: 1000, description: 'Empty sounding, like a scooped midrange.' },
  { id: 'distant', label: 'Distant', zone: Zone.TooLittle, minHz: 2000, maxHz: 5000, description: 'Sounds far away or veiled.' },
  { id: 'not_enough_char', label: 'Not Enough Character', zone: Zone.TooLittle, minHz: 3000, maxHz: 6000, description: 'Bland and uninteresting.' },
  { id: 'dark', label: 'Dark', zone: Zone.TooLittle, minHz: 6000, maxHz: 15000, description: 'Muffled, lacking high-end frequencies.' },
  { id: 'dull', label: 'Dull', zone: Zone.TooLittle, minHz: 10000, maxHz: 20000, description: 'Lifeless and flat.' },
];