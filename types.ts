export enum Zone {
  TooMuch = 'Too Much',
  Balanced = 'Balanced',
  TooLittle = 'Too Little'
}

export enum Band {
  SubBass = 'Sub Bass',
  Bass = 'Bass',
  LowMids = 'Low Mids',
  Mids = 'Mids',
  UpperMids = 'Upper Mids',
  Highs = 'Highs'
}

export interface FrequencyTerm {
  id: string;
  label: string;
  zone: Zone;
  minHz: number;
  maxHz: number;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface FrequencyBandDef {
  label: Band;
  minHz: number;
  maxHz: number;
  color: string;
}