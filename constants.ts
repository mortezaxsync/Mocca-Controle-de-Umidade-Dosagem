import { WheatType } from './types';

// Fatores de absorção baseados no tipo de glúten/dureza do trigo
export const WHEAT_FACTOR: Record<WheatType, number> = {
  [WheatType.COMUM]: 1.00,     // Padrão / Uso geral
  [WheatType.ESPECIAL]: 1.02,  // Melhor qualidade, absorção levemente maior
  [WheatType.INTEIRA]: 1.03,   // Maior absorção devido ao farelo
  [WheatType.COLA]: 1.05       // Alta absorção (Glúten forte)
};

// Configurações padrão
export const DEFAULT_VALUES = {
  FLOW_RATE: 6500,
  INITIAL_MOISTURE: 11.0,
  TARGET_FLOUR_MOISTURE: 14.5,
  AIR_TEMP: 25,
  AIR_HUMIDITY: 60,
  START_TIME: "06:00",
  SHIFT_DURATION: 8
};