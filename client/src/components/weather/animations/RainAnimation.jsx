export default function RainAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rain Drops */}
      {Array.from({ length: 80 }).map((_, i) => (
        <span
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.7 + Math.random() * 0.6}s`,
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="rain-overlay"></div>
    </div>
  );
}