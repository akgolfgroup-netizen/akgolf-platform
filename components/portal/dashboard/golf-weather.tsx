"use client";

import { motion } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MapPin,
} from "lucide-react";

type WeatherCondition = "sunny" | "partly_cloudy" | "cloudy" | "rainy" | "windy";
type PlayabilityScore = "excellent" | "good" | "fair" | "poor";

interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  feelsLike: number;
  windSpeed: number; // km/h
  windDirection: string;
  humidity: number;
  rainProbability: number;
  sunrise: string;
  sunset: string;
  location: string;
}

interface GolfWeatherProps {
  weather: WeatherData;
}

const conditionIcons: Record<WeatherCondition, React.ComponentType<{ className?: string }>> = {
  sunny: Sun,
  partly_cloudy: Cloud,
  cloudy: Cloud,
  rainy: CloudRain,
  windy: Wind,
};

const conditionLabels: Record<WeatherCondition, string> = {
  sunny: "Sol",
  partly_cloudy: "Delvis skyet",
  cloudy: "Overskyet",
  rainy: "Regn",
  windy: "Vind",
};

function calculatePlayability(weather: WeatherData): PlayabilityScore {
  let score = 100;

  // Temperature impact
  if (weather.temperature < 5 || weather.temperature > 30) score -= 30;
  else if (weather.temperature < 10 || weather.temperature > 25) score -= 10;

  // Wind impact (major factor in golf)
  if (weather.windSpeed > 40) score -= 40;
  else if (weather.windSpeed > 25) score -= 25;
  else if (weather.windSpeed > 15) score -= 10;

  // Rain probability
  if (weather.rainProbability > 70) score -= 35;
  else if (weather.rainProbability > 40) score -= 20;
  else if (weather.rainProbability > 20) score -= 5;

  // Humidity (minor factor)
  if (weather.humidity > 85) score -= 10;

  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "poor";
}

const playabilityConfig: Record<PlayabilityScore, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  excellent: {
    label: "Perfekt golfvar!",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: CheckCircle,
  },
  good: {
    label: "Gode forhold",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    icon: CheckCircle,
  },
  fair: {
    label: "OK forhold",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: AlertTriangle,
  },
  poor: {
    label: "Krevende forhold",
    color: "text-red-400",
    bg: "bg-red-500/10",
    icon: XCircle,
  },
};

export function GolfWeather({ weather }: GolfWeatherProps) {
  const WeatherIcon = conditionIcons[weather.condition];
  const playability = calculatePlayability(weather);
  const playabilityInfo = playabilityConfig[playability];
  const PlayabilityIcon = playabilityInfo.icon;

  // Best time to play based on conditions
  const getBestTime = () => {
    if (weather.temperature > 25) return "Tidlig morgen eller kveld";
    if (weather.windSpeed > 20) return "Morgen (mindre vind)";
    if (weather.rainProbability > 50) return "Sjekk radaren forst";
    return "Hele dagen";
  };

  return (
    <div className="portal-card rounded-2xl overflow-hidden">
      {/* Main weather display */}
      <div className="relative p-5 pb-4">
        {/* Background gradient based on condition */}
        <div
          className={`absolute inset-0 opacity-20 ${
            weather.condition === "sunny"
              ? "bg-gradient-to-br from-amber-500/30 to-orange-500/10"
              : weather.condition === "rainy"
              ? "bg-gradient-to-br from-blue-500/30 to-slate-500/10"
              : "bg-gradient-to-br from-slate-400/30 to-slate-500/10"
          }`}
        />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--portal-text-muted)] mb-2">
              <MapPin className="w-3 h-3" />
              <span>{weather.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                animate={weather.condition === "sunny" ? { rotate: [0, 10, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <WeatherIcon
                  className={`w-12 h-12 ${
                    weather.condition === "sunny"
                      ? "text-amber-400"
                      : weather.condition === "rainy"
                      ? "text-blue-400"
                      : "text-[var(--color-grey-400)]"
                  }`}
                />
              </motion.div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {weather.temperature}
                  </span>
                  <span className="text-lg text-[var(--portal-text-muted)]">°C</span>
                </div>
                <p className="text-xs text-[var(--portal-text-muted)]">
                  {conditionLabels[weather.condition]}
                </p>
              </div>
            </div>
          </div>

          {/* Playability indicator */}
          <div className={`px-3 py-2 rounded-xl ${playabilityInfo.bg}`}>
            <div className="flex items-center gap-2">
              <PlayabilityIcon className={`w-4 h-4 ${playabilityInfo.color}`} />
              <span className={`text-xs font-medium ${playabilityInfo.color}`}>
                {playabilityInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather details grid */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-4 gap-3">
          {/* Wind */}
          <div className="p-3 rounded-xl bg-[var(--color-grey-100)]">
            <div className="flex items-center gap-1.5 text-[var(--portal-text-muted)] mb-1">
              <Wind className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Vind</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {weather.windSpeed} km/t
            </p>
            <p className="text-[10px] text-[var(--portal-text-muted)]">
              {weather.windDirection}
            </p>
          </div>

          {/* Humidity */}
          <div className="p-3 rounded-xl bg-[var(--color-grey-100)]">
            <div className="flex items-center gap-1.5 text-[var(--portal-text-muted)] mb-1">
              <Droplets className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Fukt</span>
            </div>
            <p className="text-sm font-semibold text-white">{weather.humidity}%</p>
          </div>

          {/* Rain probability */}
          <div className="p-3 rounded-xl bg-[var(--color-grey-100)]">
            <div className="flex items-center gap-1.5 text-[var(--portal-text-muted)] mb-1">
              <CloudRain className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Regn</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {weather.rainProbability}%
            </p>
          </div>

          {/* Feels like */}
          <div className="p-3 rounded-xl bg-[var(--color-grey-100)]">
            <div className="flex items-center gap-1.5 text-[var(--portal-text-muted)] mb-1">
              <Thermometer className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Foles</span>
            </div>
            <p className="text-sm font-semibold text-white">{weather.feelsLike}°C</p>
          </div>
        </div>
      </div>

      {/* Best time to play */}
      <div className="px-5 pb-5">
        <div className="p-3 rounded-xl bg-gradient-to-r from-gold/10 to-transparent border border-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-gold" />
            </div>
            <div>
              <p className="text-xs text-[var(--portal-text-muted)]">Beste tid a spille</p>
              <p className="text-sm font-medium text-white">{getBestTime()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo component with mock data
export function GolfWeatherDemo() {
  const mockWeather: WeatherData = {
    condition: "partly_cloudy",
    temperature: 14,
    feelsLike: 12,
    windSpeed: 12,
    windDirection: "SV",
    humidity: 65,
    rainProbability: 20,
    sunrise: "06:15",
    sunset: "19:45",
    location: "Sarpsborg Golfklubb",
  };

  return <GolfWeather weather={mockWeather} />;
}
