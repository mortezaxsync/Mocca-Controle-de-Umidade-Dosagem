import React from 'react';
import { MillingState, WheatType } from '../types';
import { Thermometer, Droplet, Clock, Gauge, Scale, Settings } from 'lucide-react';

interface Props {
  state: MillingState;
  onChange: (key: keyof MillingState, value: any) => void;
}

const ControlPanel: React.FC<Props> = ({ state, onChange }) => {
  
  const handleNumberChange = (key: keyof MillingState, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      onChange(key, num);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-800">Parâmetros de Moagem</h2>
      </div>

      <div className="space-y-6">
        
        {/* Section 1: Produção */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Produção & Matéria Prima</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-slate-400" />
                  Vazão (kg/h)
                </div>
              </label>
              <input
                type="number"
                value={state.flowRate}
                onChange={(e) => handleNumberChange('flowRate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-slate-400" />
                  Trigo Seco (%)
                </div>
              </label>
              <input
                type="number"
                step="0.1"
                value={state.initialMoisture}
                onChange={(e) => handleNumberChange('initialMoisture', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Trigo</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.values(WheatType).map((type) => (
                  <button
                    key={type}
                    onClick={() => onChange('wheatType', type)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                      state.wheatType === type
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Ambiente */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Ambiente (Ar)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-slate-400" />
                  Temp (°C)
                </div>
              </label>
              <input
                type="number"
                value={state.airTemperature}
                onChange={(e) => handleNumberChange('airTemperature', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <div className="flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-slate-400" />
                  Umidade Ar (%)
                </div>
              </label>
              <input
                type="number"
                value={state.relativeHumidity}
                onChange={(e) => handleNumberChange('relativeHumidity', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Objetivo */}
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <h3 className="text-xs font-bold text-indigo-800 uppercase mb-3 flex items-center gap-2">
             Meta de Qualidade
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-indigo-900 mb-1">
              Umidade Final da Farinha (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="13.0"
                max="15.5"
                step="0.1"
                value={state.targetFlourMoisture}
                onChange={(e) => handleNumberChange('targetFlourMoisture', e.target.value)}
                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <input
                type="number"
                step="0.1"
                value={state.targetFlourMoisture}
                onChange={(e) => handleNumberChange('targetFlourMoisture', e.target.value)}
                className="w-20 px-2 py-1 text-center font-bold text-indigo-700 bg-white border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-indigo-600 mt-1">Normalmente entre 14.0% e 15.0%</p>
          </div>

          <div>
             <label className="block text-xs font-medium text-indigo-800 mb-1">
               Ajuste de Quebra de Moagem (%)
             </label>
             <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Auto"
                  value={state.manualLossOverride ?? ''}
                  onChange={(e) => {
                    if (e.target.value === '') onChange('manualLossOverride', null);
                    else handleNumberChange('manualLossOverride', e.target.value);
                  }}
                  className="w-full px-2 py-1 text-sm bg-white border border-indigo-200 rounded-md focus:outline-none"
                />
                <button 
                  onClick={() => onChange('manualLossOverride', null)}
                  className="text-xs text-indigo-600 underline whitespace-nowrap"
                >
                  Usar Auto
                </button>
             </div>
             <p className="text-[10px] text-indigo-500 mt-1">
               {state.manualLossOverride === null 
                 ? "Calculado automaticamente pelo clima." 
                 : "Valor manual definido."}
             </p>
          </div>
        </div>

        {/* Section 4: Cronograma Setup */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Turno</h3>
          <div className="flex gap-4">
            <div className="flex-1">
               <label className="block text-sm font-medium text-slate-700 mb-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Início
                </div>
              </label>
              <input
                type="time"
                value={state.startTime}
                onChange={(e) => onChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
             <div className="flex-1">
               <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duração (h)
              </label>
              <input
                type="number"
                value={state.shiftDuration}
                onChange={(e) => handleNumberChange('shiftDuration', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ControlPanel;