import React from 'react';
import { ArrowRight, Droplets, Factory, Wheat } from 'lucide-react';

interface Props {
  initialMoisture: number;
  targetTempering: number;
  targetFlour: number;
  loss: number;
}

const ProcessFlow: React.FC<Props> = ({ initialMoisture, targetTempering, targetFlour, loss }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Fluxo de Umidade (Balanço de Massa)</h3>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Step 1: Dry Wheat */}
        <div className="flex flex-col items-center text-center p-3 bg-amber-50 rounded-lg flex-1 border border-amber-100 w-full">
          <div className="bg-amber-100 p-2 rounded-full mb-2">
            <Wheat className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-xs text-amber-800 font-bold mb-1">TRIGO SECO</span>
          <span className="text-xl font-bold text-slate-800">{initialMoisture.toFixed(1)}%</span>
          <span className="text-xs text-slate-500">Umidade Inicial</span>
        </div>

        <div className="flex flex-col items-center">
          <ArrowRight className="w-5 h-5 text-slate-300 md:rotate-0 rotate-90 my-2" />
          <div className="flex items-center gap-1 text-blue-600 text-xs font-medium bg-blue-50 px-2 py-1 rounded-full">
            <Droplets className="w-3 h-3" />
            <span>Adição Água</span>
          </div>
        </div>

        {/* Step 2: Tempered Wheat */}
        <div className="flex flex-col items-center text-center p-3 bg-blue-50 rounded-lg flex-1 border border-blue-100 w-full">
          <div className="bg-blue-100 p-2 rounded-full mb-2">
            <Droplets className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs text-blue-800 font-bold mb-1">REPOUSO (B1)</span>
          <span className="text-xl font-bold text-slate-800">{targetTempering.toFixed(1)}%</span>
          <span className="text-xs text-slate-500">Umidade Alvo</span>
        </div>

        <div className="flex flex-col items-center">
          <ArrowRight className="w-5 h-5 text-slate-300 md:rotate-0 rotate-90 my-2" />
          <div className="flex items-center gap-1 text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">
            <Factory className="w-3 h-3" />
            <span>Perda {loss.toFixed(1)}%</span>
          </div>
        </div>

        {/* Step 3: Flour */}
        <div className="flex flex-col items-center text-center p-3 bg-green-50 rounded-lg flex-1 border border-green-100 w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 bg-green-200 text-[10px] font-bold text-green-800 rounded-bl-lg">
            OBJETIVO
          </div>
          <div className="bg-green-100 p-2 rounded-full mb-2">
            <Wheat className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-xs text-green-800 font-bold mb-1">FARINHA FINAL</span>
          <span className="text-2xl font-black text-green-700">{targetFlour.toFixed(1)}%</span>
          <span className="text-xs text-slate-500">Na Ensacadeira</span>
        </div>

      </div>
    </div>
  );
};

export default ProcessFlow;