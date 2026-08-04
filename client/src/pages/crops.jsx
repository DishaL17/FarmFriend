import { useState, useEffect } from "react";import Nav from "../components/nav+side/nav";
import Sidebar from "../components/nav+side/sidebar";
import { getCrops } from "../api/crop";
import Cropcard from "../components/crops/Cropcard";

export default function Crops(){
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
     const [crops, setCrops] = useState([]);
     return (
         <div className="flex min-h-screen bg-lime-50">
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
        
              <main className="flex-1 flex flex-col lg:ml-64 bg-lime-50 min-w-0">
                <Nav setIsSidebarOpen={setIsSidebarOpen} />
                <Cropcard />
                
              </main>
            </div>
     );
}