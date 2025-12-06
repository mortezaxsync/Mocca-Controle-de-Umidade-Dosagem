import React, { useState, useMemo } from 'react';
import { MillingState, WheatType } from './types';
import { DEFAULT_VALUES } from './constants';
import { calculateWaterDosage } from './utils/calculations';
import ControlPanel from './components/ControlPanel';
import ProcessFlow from './components/ProcessFlow';
import ScheduleTable from './components/ScheduleTable';
import WeatherWidget from './components/WeatherWidget';
import { Droplets, Activity, Calendar, Crosshair } from 'lucide-react';

function App() {
  // Estado principal da aplicação
  const [millingState, setMillingState] = useState<MillingState>({
    startTime: DEFAULT_VALUES.START_TIME,
    shiftDuration: DEFAULT_VALUES.SHIFT_DURATION,
    flowRate: DEFAULT_VALUES.FLOW_RATE,
    initialMoisture: DEFAULT_VALUES.INITIAL_MOISTURE,
    wheatType: WheatType.COLA,
    airTemperature: DEFAULT_VALUES.AIR_TEMP,
    relativeHumidity: DEFAULT_VALUES.AIR_HUMIDITY,
    targetFlourMoisture: DEFAULT_VALUES.TARGET_FLOUR_MOISTURE,
    manualLossOverride: null
  });

  // Handler para atualizar o estado
  const handleStateChange = (key: keyof MillingState, value: any) => {
    setMillingState(prev => ({ ...prev, [key]: value }));
  };

  // Cálculo automático usando useMemo para performance
  const results = useMemo(() => calculateWaterDosage(millingState), [millingState]);

  // Data atual para exibição
  const today = new Date().toLocaleDateString('pt-BR');

  // Brand Color
  const BRAND_BLUE = '#2c5ba6';

  return (
    <div className="min-h-screen bg-slate-50 pb-12 print:bg-white font-sans">
      
      {/* HEADER NOVO - MODERNO E ASSIMÉTRICO */}
      <header className="w-full bg-[#1e2330] shadow-xl overflow-hidden print:hidden mb-8 relative z-20">
        <div className="max-w-[1920px] mx-auto flex h-36">
          
          {/* LADO ESQUERDO: LOGO (Fundo Branco com Corte Diagonal) */}
          <div 
            className="bg-white h-full relative z-10 flex items-center justify-center pl-6 lg:pl-10 pr-28 shrink-0"
            style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)', width: 'fit-content' }}
          >
            <div className="flex flex-col leading-none items-center">
              {/* Título MOCCA */}
              <h1 
                className="text-[4.5rem] font-black tracking-tighter leading-[0.8] mb-1" 
                style={{ color: BRAND_BLUE, fontFamily: 'Inter, sans-serif' }}
              >
                MOCCA
              </h1>
              
              {/* Subtítulo Stencil */}
              <div 
                className="flex flex-col items-center font-stencil text-2xl uppercase tracking-widest w-full"
                style={{ color: BRAND_BLUE }}
              >
                <span className="leading-none whitespace-nowrap">Moinho Comercial</span>
                <span className="leading-none mt-1">de Céu Azul</span>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: TÍTULO E WIDGETS (Fundo Escuro) */}
          <div className="flex-1 flex items-center justify-between px-8 lg:px-16 text-white overflow-hidden">
            
            {/* Título Central com Ícone */}
            <div className="flex items-center gap-6 shrink-0">
              {/* Ícone Circular Estilizado */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg relative shrink-0 hidden xl:flex">
                 <Crosshair className="w-12 h-12 text-[#0ea5e9] absolute opacity-40" strokeWidth={1} />
                 <Droplets className="w-8 h-8 text-[#0ea5e9] fill-[#0ea5e9] relative z-10" />
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-semibold leading-tight text-slate-100 hidden lg:block">
                Controle de Umidade & <br />
                <span className="font-bold text-white">Dosagem</span>
              </h2>
            </div>

            {/* Widgets Section: Weather + Date */}
            <div className="flex items-center gap-6 ml-auto">
              
              {/* Weather Widget */}
              <WeatherWidget />

              {/* Widget de Data e Status */}
              <div className="bg-white text-slate-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 shrink-0 h-[86px]">
                <div className="bg-[#0ea5e9]/10 p-2 rounded-lg">
                  <Calendar className="w-8 h-8 text-[#0ea5e9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight">{today}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-[#0ea5e9]">Status: OK</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 print:hidden">
            <ControlPanel state={millingState} onChange={handleStateChange} />
          </div>

          {/* Right Column: Results & Visualization */}
          <div className="lg:col-span-8">
            
            {/* Visual Process Flow */}
            <ProcessFlow 
              initialMoisture={millingState.initialMoisture}
              targetTempering={results.targetTemperingMoisture}
              targetFlour={millingState.targetFlourMoisture}
              loss={results.estimatedLoss}
            />

            {/* Main Result Big Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Droplets className="w-32 h-32" />
                </div>
                <div>
                  <h2 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2 border-b border-blue-400/30 pb-2 inline-block">
                    Dosagem da Bomba
                  </h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-bold tracking-tighter">
                      {results.litersPerHour}
                    </span>
                    <span className="text-2xl font-medium text-blue-200">L/h</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 flex items-center justify-between">
                   <span className="text-sm text-blue-100 opacity-90 font-medium bg-blue-700/50 px-3 py-1 rounded-full">
                     Fluxo: {millingState.flowRate} kg/h
                   </span>
                   <Activity className="w-5 h-5 text-blue-300 animate-pulse" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center gap-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                  <span className="text-slate-500 text-sm font-medium">Umidade Alvo (Repouso)</span>
                  <span className="text-3xl font-bold text-slate-800 tracking-tight">{results.targetTemperingMoisture.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                  <span className="text-slate-500 text-sm font-medium">Quebra Estimada</span>
                  <div className="flex items-center gap-1 text-red-600">
                    <span className="text-xs font-bold bg-red-50 px-1.5 py-0.5 rounded uppercase">Perda</span>
                    <span className="text-2xl font-bold">-{results.estimatedLoss.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-slate-500 text-sm font-medium">Consumo Específico</span>
                  <span className="text-xl font-bold text-slate-700">{results.waterPerTon} <span className="text-sm font-normal text-slate-400">L/ton</span></span>
                </div>
              </div>
            </div>

            {/* Schedule Table */}
            <ScheduleTable schedule={results.schedule} date={today} />

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;