import React from 'react';
import { ScheduleItem } from '../types';
import { Printer, Calendar } from 'lucide-react';

interface Props {
  schedule: ScheduleItem[];
  date: string;
}

const ScheduleTable: React.FC<Props> = ({ schedule, date }) => {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:bg-white">
        <div className="flex items-center gap-2">
           <Calendar className="w-5 h-5 text-slate-500" />
           <h3 className="font-bold text-slate-700">Cronograma de Molhamento - {date}</h3>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-200 transition print:hidden"
        >
          <Printer className="w-4 h-4" />
          Imprimir
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Hora</th>
              <th className="px-6 py-3 font-semibold">Vazão (kg/h)</th>
              <th className="px-6 py-3 font-semibold text-blue-700 bg-blue-50">Água (L/h)</th>
              <th className="px-6 py-3 font-semibold">Temp. Ar Ref.</th>
              <th className="px-6 py-3 font-semibold">Observações</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{row.time}</td>
                <td className="px-6 py-4 text-slate-600">{row.flowRate}</td>
                <td className="px-6 py-4 font-bold text-blue-700 bg-blue-50/50 text-lg">
                  {row.litersPerHour}
                </td>
                <td className="px-6 py-4 text-slate-500">{row.checkTemp}°C</td>
                <td className="px-6 py-4 text-slate-400 italic text-xs">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-slate-50 text-xs text-slate-400 text-center border-t border-slate-100 print:hidden">
        Os valores podem precisar de ajuste fino dependendo da calibração real da bomba.
      </div>
    </div>
  );
};

export default ScheduleTable;