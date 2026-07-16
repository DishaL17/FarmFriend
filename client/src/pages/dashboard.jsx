import Nav from "../components/nav+side/nav.jsx";
import Sidebar from "../components/nav+side/sidebar.jsx";
import Hero from "../components/hero/hero.jsx";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-lime-50">
      <Sidebar />

      <main className="flex-1 flex flex-col w-full overflow-x-hidden">
        <Nav />

        <div className="flex-1 w-full  sm:p-6">
          <Hero />
        </div>
      </main>
    </div>
  );
}