import { useState, useEffect } from 'react';

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  emoji: string;
}

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  humidity: number;
  is_day: number;
}

const cities: City[] = [
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, emoji: '🗼' },
  { name: 'Londres', country: 'Royaume-Uni', lat: 51.5074, lon: -0.1278, emoji: '🇬🇧' },
  { name: 'New York', country: 'États-Unis', lat: 40.7128, lon: -74.006, emoji: '🗽' },
  { name: 'Tokyo', country: 'Japon', lat: 35.6762, lon: 139.6503, emoji: '🗾' },
  { name: 'Sydney', country: 'Australie', lat: -33.8688, lon: 151.2093, emoji: '🦘' },
  { name: 'Dubaï', country: 'Émirats Arabes Unis', lat: 25.2048, lon: 55.2708, emoji: '🏙️' },
  { name: 'Rio de Janeiro', country: 'Brésil', lat: -22.9068, lon: -43.1729, emoji: '🇧🇷' },
  { name: 'Le Caire', country: 'Égypte', lat: 30.0444, lon: 31.2357, emoji: '🏛️' },
  { name: 'Moscou', country: 'Russie', lat: 55.7558, lon: 37.6173, emoji: '🇷🇺' },
  { name: 'Marrakech', country: 'Maroc', lat: 31.6295, lon: -7.9811, emoji: '🇲🇦' },
];

function getWeatherInfo(code: number): { description: string; icon: string; bgClass: string } {
  const weatherMap: Record<number, { description: string; icon: string; bgClass: string }> = {
    0: { description: 'Ciel dégagé', icon: '☀️', bgClass: 'from-yellow-400 to-orange-500' },
    1: { description: 'Principalement dégagé', icon: '🌤️', bgClass: 'from-yellow-300 to-orange-400' },
    2: { description: 'Partiellement nuageux', icon: '⛅', bgClass: 'from-blue-300 to-gray-400' },
    3: { description: 'Couvert', icon: '☁️', bgClass: 'from-gray-400 to-gray-600' },
    45: { description: 'Brouillard', icon: '🌫️', bgClass: 'from-gray-300 to-gray-500' },
    48: { description: 'Brouillard givrant', icon: '🌫️', bgClass: 'from-blue-200 to-gray-400' },
    51: { description: 'Bruine légère', icon: '🌦️', bgClass: 'from-blue-400 to-blue-600' },
    53: { description: 'Bruine modérée', icon: '🌦️', bgClass: 'from-blue-500 to-blue-700' },
    55: { description: 'Bruine dense', icon: '🌧️', bgClass: 'from-blue-600 to-blue-800' },
    61: { description: 'Pluie légère', icon: '🌧️', bgClass: 'from-blue-500 to-indigo-600' },
    63: { description: 'Pluie modérée', icon: '🌧️', bgClass: 'from-blue-600 to-indigo-700' },
    65: { description: 'Forte pluie', icon: '🌧️', bgClass: 'from-blue-700 to-indigo-800' },
    71: { description: 'Neige légère', icon: '🌨️', bgClass: 'from-blue-100 to-blue-300' },
    73: { description: 'Neige modérée', icon: '🌨️', bgClass: 'from-blue-200 to-blue-400' },
    75: { description: 'Forte neige', icon: '❄️', bgClass: 'from-blue-200 to-indigo-400' },
    80: { description: 'Averses légères', icon: '🌦️', bgClass: 'from-blue-400 to-blue-600' },
    81: { description: 'Averses modérées', icon: '🌧️', bgClass: 'from-blue-500 to-blue-700' },
    82: { description: 'Averses violentes', icon: '⛈️', bgClass: 'from-gray-600 to-indigo-800' },
    95: { description: 'Orage', icon: '⛈️', bgClass: 'from-gray-700 to-purple-900' },
    96: { description: 'Orage avec grêle', icon: '⛈️', bgClass: 'from-gray-800 to-purple-900' },
    99: { description: 'Orage violent avec grêle', icon: '⛈️', bgClass: 'from-gray-900 to-purple-950' },
  };
  return weatherMap[code] || { description: 'Inconnu', icon: '🌡️', bgClass: 'from-gray-400 to-gray-600' };
}

function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: City) => {
    setLoading(true);
    setError(null);
    setSelectedCity(city);
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=auto`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Impossible de récupérer les données météo');
      }
      
      const data = await response.json();
      const current = data.current;
      
      setWeather({
        temperature: current.temperature_2m,
        windspeed: current.wind_speed_10m,
        weathercode: current.weather_code,
        humidity: current.relative_humidity_2m,
        is_day: current.is_day,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Charger la météo de Paris par défaut
    fetchWeather(cities[0]);
  }, []);

  const weatherInfo = weather ? getWeatherInfo(weather.weathercode) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="py-8 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
          🌍 Météo des Villes
        </h1>
        <p className="text-blue-200 text-lg">Sélectionnez une ville pour voir sa météo actuelle</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        {/* City Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => fetchWeather(city)}
              className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                selectedCity?.name === city.name
                  ? 'bg-white/20 ring-2 ring-white/50 shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              <span className="text-2xl block mb-1">{city.emoji}</span>
              <span className="text-sm font-semibold block">{city.name}</span>
              <span className="text-xs text-blue-200 block">{city.country}</span>
            </button>
          ))}
        </div>

        {/* Weather Display */}
        <div className="flex justify-center">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-transparent"></div>
              <p className="mt-4 text-blue-200 text-lg">Chargement de la météo...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-6 max-w-md text-center">
              <span className="text-4xl block mb-2">⚠️</span>
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {weather && weatherInfo && selectedCity && !loading && (
            <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br ${weatherInfo.bgClass} transition-all duration-500`}>
              {/* Weather Card */}
              <div className="p-8">
                {/* City Info */}
                <div className="text-center mb-6">
                  <span className="text-5xl block mb-2">{selectedCity.emoji}</span>
                  <h2 className="text-3xl font-bold">{selectedCity.name}</h2>
                  <p className="text-white/80">{selectedCity.country}</p>
                </div>

                {/* Main Weather */}
                <div className="text-center mb-8">
                  <span className="text-7xl block mb-2">{weatherInfo.icon}</span>
                  <p className="text-5xl font-bold mb-1">{Math.round(weather.temperature)}°C</p>
                  <p className="text-xl text-white/90 font-medium">{weatherInfo.description}</p>
                  <p className="text-sm text-white/70 mt-1">
                    {weather.is_day ? '🌞 Jour' : '🌙 Nuit'}
                  </p>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                    <span className="text-2xl block mb-1">💨</span>
                    <p className="text-sm text-white/70">Vent</p>
                    <p className="text-lg font-bold">{weather.windspeed} km/h</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                    <span className="text-2xl block mb-1">💧</span>
                    <p className="text-sm text-white/70">Humidité</p>
                    <p className="text-lg font-bold">{weather.humidity}%</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-white/50">
                  Données fournies par Open-Meteo API
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Script Python Info */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🐍</span> Équivalent en Python
            </h3>
            <p className="text-blue-200 mb-4 text-sm">
              Voici le script Python équivalent qui affiche la météo d'une ville parmi une liste de 10 :
            </p>
            <pre className="bg-black/40 rounded-xl p-4 overflow-x-auto text-sm text-green-300 font-mono">
{`import requests

villes = [
    ("Paris", 48.8566, 2.3522),
    ("Londres", 51.5074, -0.1278),
    ("New York", 40.7128, -74.006),
    ("Tokyo", 35.6762, 139.6503),
    ("Sydney", -33.8688, 151.2093),
    ("Dubaï", 25.2048, 55.2708),
    ("Rio de Janeiro", -22.9068, -43.1729),
    ("Le Caire", 30.0444, 31.2357),
    ("Moscou", 55.7558, 37.6173),
    ("Marrakech", 31.6295, -7.9811),
]

print("=== Météo des Villes ===")
for i, (nom, lat, lon) in enumerate(villes, 1):
    print(f"{i}. {nom}")

choix = int(input("\\nChoisissez une ville (1-10) : "))
ville = villes[choix - 1]

url = f"https://api.open-meteo.com/v1/forecast"
params = {
    "latitude": ville[1],
    "longitude": ville[2],
    "current": "temperature_2m,weather_code,wind_speed_10m",
    "timezone": "auto"
}

reponse = requests.get(url, params=params)
donnees = reponse.json()["current"]

print(f"\\n🌡️  Météo à {ville[0]} :")
print(f"   Température : {donnees['temperature_2m']}°C")
print(f"   Vent : {donnees['wind_speed_10m']} km/h")
print(f"   Code météo : {donnees['weather_code']}")`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
