import mainimage from "../assets/images/main.png";
import Navbar from "../components/navbar/navbar";

import {
  FaWallet,
  FaChartLine,
} from "react-icons/fa";

import { MdStorefront } from "react-icons/md";

export default function Home() {
  return (
    <>
      <Navbar />
     <header
  className="min-h-screen bg-cover bg-[right_25%_center] sm:bg-center flex items-start pt-16 sm:pt-20"
  style={{
    backgroundImage: `url(${mainimage})`,
  }}
>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -translate-y-15">
          <div className="max-w-2xl">

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-green-700 mb-2 sm:mb-5 ">
              About FarmFriend
            </h1>

            <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm sm:text-base font-medium">
              🌱 Helping Farmers Manage Their Farms Smarter
            </div>

            <p className=" sm:mt-6 text-base sm:text-lg text-gray-700 leading-7 sm:leading-8">
              Manage expenses, track profits, book mandi slots,
              receive weather updates, and make data-driven
              farming decisions—all from one platform.
            </p>

            <button className="mt-8 bg-green-600 text-white px-6 sm:px-7 py-3 rounded-lg hover:bg-green-700 transition  sm:w-auto">
              Get Started
            </button>

            {/* Feature Cards */}
            <div className="flex flex-col sm:flex-row  gap-6 mt-12">

              <div className="bg-lime-50 shadow-lg rounded-2xl h-30 w-30  flex flex-col justify-center items-center hover:scale-105 transition">
                <FaWallet className="text-4xl text-green-600 mb-3" />
                <p className="font-semibold text-center">
                  Expense
                  <br />
                  Management
                </p>
              </div>

              <div className="bg-lime-50 shadow-lg rounded-2xl h-30 w-30 flex flex-col justify-center items-center hover:scale-105 transition">
                <FaChartLine className="text-4xl text-green-600 mb-3" />
                <p className="font-semibold text-center">
                  Profit
                  <br />
                  Tracking
                </p>
              </div>

              <div className="bg-lime-50 shadow-lg rounded-2xl h-30 w-30 flex flex-col justify-center items-center hover:scale-105 transition sm:col-span-2 lg:col-span-1">
                <MdStorefront className="text-4xl text-green-600 mb-3" />
                <p className="font-semibold text-center">
                  Mandi
                  <br />
                  Token
                </p>
              </div>

            </div>

          </div>
        </div>
      </header>
    </>
  );
}