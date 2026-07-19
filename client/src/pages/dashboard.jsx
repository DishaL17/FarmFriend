import Nav from "../components/nav+side/nav.jsx";
import Sidebar from "../components/nav+side/sidebar.jsx";
import Hero from "../components/hero/hero.jsx";
import { useState, useEffect } from "react";
import Finance from "../components/finance/Finance.jsx";
import Transaction from "../components/finance/Transactions.jsx";
import RecentTransactions from "../components/finance/RecentTransactions";
import MandiPrices from "../components/Mandi/mandiprices.jsx";


export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
    loadCrops();
  }, []);

  async function loadCrops() {
    try {
      const response = await fetch("http://localhost:5000/crops");
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.crops)) {
        setCrops(data.crops);
      }
    } catch (err) {
      console.error("Failed to load crops on dashboard:", err);
    }
  }

  async function loadTransactions() {
    try {
      const response = await fetch("http://localhost:5000/transactions");
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen bg-lime-50 ">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col w-full overflow-x-hidden lg:ml-64">
        <Nav setIsSidebarOpen={setIsSidebarOpen} />

        <div className="flex-1 w-full p-4 sm:p-6 space-y-6">
          <Hero />
          
          

         
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
  <Finance transactions={transactions} crops={crops} />
   <RecentTransactions transactions={transactions} loading={loading} />
            </div>
           
            <MandiPrices crops={crops} />
          </div>
        </div>
      </main>

      {isTransactionModalOpen && (
        <Transaction
          onClose={() => setIsTransactionModalOpen(false)}
          onSuccess={loadTransactions}
        />
      )}
    </div>
  );
}

