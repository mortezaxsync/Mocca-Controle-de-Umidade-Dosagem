
import React, { useState, useMemo } from 'react';
import { MillingState, WheatType } from './types';
import { DEFAULT_VALUES } from './constants';
import { calculateWaterDosage } from './utils/calculations';
import ControlPanel from './components/ControlPanel';
import ProcessFlow from './components/ProcessFlow';
import ScheduleTable from './components/ScheduleTable';
import { Droplets, Activity, Wheat } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50 pb-12 print:bg-white font-sans">
      
      {/* HEADER CUSTOMIZADO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 print:hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* LOGO MOCCA */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="flex items-center gap-3">
              {/* Trigo Esquerdo */}
              <Wheat 
                className="w-12 h-12 text-yellow-400 -rotate-12" 
                strokeWidth={2.5} 
              />
              <div className="text-7xl font-black text-blue-700 tracking-wide">
                MOCCA
              </div>
              {/* Trigo Direito */}
              <Wheat 
                className="w-12 h-12 text-yellow-400 rotate-12 transform scale-x-[-1]" 
                strokeWidth={2.5} 
              />
            </div>
            <div className="text-sm font-bold text-blue-700 tracking-[0.2em] uppercase mt-1">
              Moinho Comercial Céu Azul
            </div>
          </div>

          {/* CARD PRETO/AZUL (HEADER) */}
          <div className="w-full max-w-2xl bg-[#0f172a] text-white rounded-3xl p-6 shadow-2xl flex items-center justify-between min-h-[140px] relative overflow-hidden">
             {/* Efeito de fundo sutil */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

             <div className="flex items-center gap-6 relative z-10">
               {/* Icon Box */}
               <div className="bg-blue-600 h-20 w-20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                  <Droplets className="w-10 h-10 text-white fill-white" strokeWidth={1.5} />
               </div>
               
               {/* Titles */}
               <div className="flex flex-col justify-center">
                 <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                   Controle de <br/>
                   <span className="text-blue-100">Umidade & Dosagem</span>
                 </h1>
               </div>
             </div>

             {/* Date */}
             <div className="text-right h-full flex flex-col justify-start relative z-10">
               <span className="text-xl font-medium text-slate-300 tracking-wide">{today}</span>
             </div>
          </div>

        </div>
      </div>
      
      {/* Separator visual */}
      <div className="w-full h-px bg-slate-200 max-w-7xl mx-auto mb-8 print:hidden"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
