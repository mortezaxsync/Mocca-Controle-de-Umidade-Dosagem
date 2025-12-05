import { MillingState, CalculationResult, ScheduleItem, WheatType } from '../types';
import { WHEAT_FACTOR } from '../constants';

/**
 * Calcula a perda de umidade (Quebra de Moagem) baseada no ambiente.
 * Quanto mais quente e seco o ar, mais umidade se perde no transporte pneumático e nos rolos.
 */
export const calculateMillingLoss = (temp: number, humidity: number): number => {
  // Base loss (Quebra de Moagem) em condições padrão (25°C, 60% RH)
  // Valor médio industrial estimado: 1.8%
  let loss = 1.8;

  // 1. Ajuste por Temperatura (Linear)
  // Temperaturas mais altas aumentam a evaporação.
  // Fator de sensibilidade: ~0.04% de perda extra por °C acima de 25°C.
  // Ex: 30°C -> +0.2% de perda.
  const tempDiff = temp - 25;
  loss += tempDiff * 0.04;

  // 2. Ajuste por Umidade do Ar (Linear)
  // Ar mais seco (RH menor) "puxa" mais umidade do produto.
  // Ar mais úmido (RH maior) reduz a evaporação.
  // Sensibilidade: ~0.02% de perda a cada 1% de variação da umidade base (60%).
  // Ex: Se cair de 60% para 40% (diferença de 20), a perda aumenta em 0.4%.
  const humidityDiff = 60 - humidity;
  loss += humidityDiff * 0.02;

  // Limites operacionais físicos
  // A quebra dificilmente é menor que 0.5% ou maior que 4.0% em moinhos normais.
  return Math.min(Math.max(loss, 0.5), 4.0);
};

export const calculateWaterDosage = (state: MillingState): CalculationResult => {
  const {
    flowRate,
    initialMoisture,
    targetFlourMoisture,
    airTemperature,
    relativeHumidity,
    manualLossOverride,
    wheatType,
    startTime,
    shiftDuration
  } = state;

  // 1. Determinar a perda de moagem (Calculada ou Manual)
  const estimatedLoss = manualLossOverride !== null 
    ? manualLossOverride 
    : calculateMillingLoss(airTemperature, relativeHumidity);

  // 2. Definir o alvo do trigo molhado (Umidade de Repouso)
  // Ex: Quer farinha 14.5%, perde 1.8% no processo -> Precisa molhar até 16.3%
  const targetTemperingMoisture = targetFlourMoisture + estimatedLoss;

  // 3. Calcular água necessária (Fórmula Industrial Padrão)
  // Litros = kg/h * ( (UmidadeAlvo - UmidadeInicial) / (100 - UmidadeAlvo) )
  // Nota: A fórmula divide por (100 - UmidadeAlvo) para considerar a massa final úmida
  const moistureDiff = targetTemperingMoisture - initialMoisture;
  
  if (moistureDiff <= 0) {
    return {
      estimatedLoss,
      targetTemperingMoisture,
      litersPerHour: 0,
      waterPerTon: 0,
      schedule: []
    };
  }

  // Fórmula matemática exata de balanço de massa
  let litersPerHour = flowRate * ( (targetTemperingMoisture - initialMoisture) / (100 - targetTemperingMoisture) );

  // 4. Aplicar fator de correção do tipo de trigo (Ajuste fino prático)
  // Trigos "Cola" (mais glúten) tendem a segurar a água melhor, ou exigem mais água para penetrar
  // Aqui usamos como um fator de eficiência de absorção
  const typeFactor = WHEAT_FACTOR[wheatType] || 1.0;
  
  // Aplicamos o fator do trigo sobre a dosagem calculada
  litersPerHour = litersPerHour * typeFactor;
  
  // Arredondar
  litersPerHour = Math.round(litersPerHour);

  // 5. Gerar Cronograma
  const schedule: ScheduleItem[] = [];
  const [startH, startM] = startTime.split(':').map(Number);
  
  for (let i = 0; i < shiftDuration; i++) {
    const hour = (startH + i) % 24;
    const timeStr = `${hour.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;
    
    // Simula pequena variação térmica ao longo do dia para o cronograma (opcional, aqui mantemos fixo para clareza)
    schedule.push({
      time: timeStr,
      flowRate: flowRate,
      litersPerHour: litersPerHour,
      checkTemp: airTemperature, // Em um app v2, isso poderia variar por hora
      note: i === 0 ? "Início do Turno - Verificar B1" : "Monitorar fluxo"
    });
  }

  return {
    estimatedLoss: parseFloat(estimatedLoss.toFixed(2)),
    targetTemperingMoisture: parseFloat(targetTemperingMoisture.toFixed(2)),
    litersPerHour,
    waterPerTon: parseFloat((litersPerHour / (flowRate / 1000)).toFixed(1)),
    schedule
  };
};