export default function SunAnimation() {
  return (
    <>
      {/* Sun Glow */}
      <div className="sun-glow"></div>

      {/* Sun Rays */}
      <div className="sun-rays"></div>

      {/* Floating Dust */}
      <div className="particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}