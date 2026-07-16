export default function WeatherStat({ icon, label, value }) {
  return (
    <div className="flex flex-col bg-white/15 backdrop-blur-xl p-3  border border-white/30 rounded-2xl shadow-lg ">
      <p>{icon}</p>
      <p className="text-xs">{label}</p>
      <p>{value}</p>
    </div>
  );
}