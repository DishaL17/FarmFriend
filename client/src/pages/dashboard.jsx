import { useState, useEffect } from "react";

import Nav from "../components/nav+side/nav";
import Sidebar from "../components/nav+side/sidebar";
import Hero from "../components/hero/hero";
import Finance from "../components/finance/Finance";
import RecentTransactions from "../components/finance/RecentTransactions";
import MandiPrices from "../components/Mandi/mandiprices";

import { getTransactions } from "../api/transaction";
import { getCrops } from "../api/crop";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      const [transactionData, cropData] = await Promise.all([
        getTransactions(),
        getCrops(),
      ]);

      if (transactionData.success) {
        setTransactions(transactionData.transactions);
      }

      if (cropData.success) {
        setCrops(cropData.crops);
      }
    } catch (err) {
      console.error("Dashboard loading failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-lime-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col lg:ml-64">
        <Nav setIsSidebarOpen={setIsSidebarOpen} />

        <div className="flex-1 p-4 sm:p-6 space-y-6">
          <Hero />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Finance
                transactions={transactions}
                crops={crops}
              />

              <RecentTransactions
                transactions={transactions}
                loading={loading}
              />
            </div>

            <MandiPrices crops={crops} />
          </div>
        </div>
      </main>
    </div>
  );
}