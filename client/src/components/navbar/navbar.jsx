export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          🌾 FarmFriend
        </h1>

        <div className="hidden md:flex gap-6">
          <button>Home</button>
          <button>Features</button>
          <button>Login</button>
          <button>Register</button>
        </div>

        <button className="md:hidden text-3xl">
          ☰
        </button>

      </div>
    </nav>
  );
}