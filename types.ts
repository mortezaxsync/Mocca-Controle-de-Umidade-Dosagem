export enum WheatType {
  COMUM = 'COMUM',
  ESPECIAL = 'ESPECIAL',
  INTEIRA = 'INTEIRA',
  COLA = 'COLA'
}

export interface MillingState {
  // Time
  startTime: string; // HH:mm
  shiftDuration: number; // hours

  // Wheat Input
  flowRate: number; // kg/h
  initialMoisture: number; // % (Trigo Seco)
  wheatType: WheatType;

  // Environment
  airTemperature: number; // °C
  relativeHumidity: number; // %

  // Targets
  targetFlourMoisture: number; // % (Umidade Final Farinha)
  manualLossOverride: number | null; // % (Quebra de Moagem Manual)
}

export interface CalculationResult {
  estimatedLoss: number; // % moisture lost during milling
  targetTemperingMoisture: number; // % target for the wheat before milling
  litersPerHour: number; // L/h
  waterPerTon: number; // L/ton
  schedule: ScheduleItem[];
}

export interface ScheduleItem {
  time: string;
  flowRate: number;
  litersPerHour: number;
  checkTemp: number;
  note: string;
}