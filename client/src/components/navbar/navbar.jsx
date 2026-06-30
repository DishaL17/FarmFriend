export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

        <h1 className="text-2xl font-bold">
          🌾 FarmFriend
        </h1>

        <div className="flex gap-6">
          <button>Home</button>
          <button>Features</button>
          <button>Login</button>
          <button>Register</button>
        </div>

      </div>
    </nav>
  );
}