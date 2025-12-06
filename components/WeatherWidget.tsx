import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, CloudSnow, Wind, Droplets, MapPin, Loader2 } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  city?: string;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fallback: Céu Azul - PR
  const DEFAULT_LAT = -25.1561;
  const DEFAULT_LON = -53.8475;

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number, cityName?: string) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo`
        );
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
          city: cityName
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch weather", err);
        setError(true);
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, "Local");
        },
        () => {
          // Permission denied or error, use default
          fetchWeather(DEFAULT_LAT, DEFAULT_LON, "Céu Azul");
        }
      );
    } else {
      fetchWeather(DEFAULT_LAT, DEFAULT_LON, "Céu Azul");
    }
  }, []);

  const getWeatherIcon = (code: number, isDay: boolean) => {
    // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
    if (code === 0) return isDay ? <Sun className="w-10 h-10 text-yellow-400" /> : <div className="relative"><div className="w-8 h-8 rounded-full bg-slate-200 opacity-80 shadow-[0_0_15px_rgba(255,255,255,0.6)]"></div></div>;
    if (code >= 1 && code <= 3) return <Cloud className="w-10 h-10 text-slate-300" />;
    if (code >= 45 && code <= 48) return <Cloud className="w-10 h-10 text-slate-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-10 h-10 text-blue-300" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="w-10 h-10 text-white" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-10 h-10 text-blue-400" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="w-10 h-10 text-purple-300" />;
    return <Sun className="w-10 h-10 text-yellow-400" />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Céu limpo";
    if (code >= 1 && code <= 3) return "Parcialmente nublado";
    if (code >= 45 && code <= 48) return "Nevoeiro";
    if (code >= 51 && code <= 67) return "Chuva leve";
    if (code >= 71 && code <= 77) return "Neve";
    if (code >= 80 && code <= 82) return "Pancadas de chuva";
    if (code >= 95 && code <= 99) return "Tempestade";
    return "Ensolarado";
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', hour: '2-digit', minute: '2-digit' });

  if (loading) return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50 flex items-center gap-3 w-64 h-20 animate-pulse">
      <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
      <span className="text-slate-400 text-sm">Carregando clima...</span>
    </div>
  );

  if (error || !weather) return null;

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-5 py-2 rounded-xl border border-slate-700/50 shadow-xl flex items-center gap-5 min-w-[320px]">
      
      {/* Icon */}
      <div className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
        {getWeatherIcon(weather.weatherCode, weather.isDay)}
      </div>

      {/* Main Temp */}
      <div className="flex flex-col border-r border-slate-600/50 pr-5">
        <span className="text-4xl font-light tracking-tighter flex">
          {weather.temperature}°<span className="text-lg text-slate-400 mt-1 ml-0.5">C</span>
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col text-xs space-y-1 min-w-[140px]">
        <div className="text-right text-slate-100 font-medium tracking-wide">
          Clima {weather.city === "Céu Azul" ? "(Céu Azul)" : ""}
        </div>
        <div className="text-right text-slate-400 capitalize truncate">
          {currentDate}
        </div>
        <div className="flex items-center justify-end gap-3 text-slate-400 pt-1">
          <div className="flex items-center gap-1" title="Umidade">
             <Droplets className="w-3 h-3 text-blue-400" />
             <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1" title="Vento">
             <Wind className="w-3 h-3 text-slate-300" />
             <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
        <div className="text-right text-slate-300 text-[10px] uppercase tracking-wider font-semibold">
           {getWeatherDescription(weather.weatherCode)}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
