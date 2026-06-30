import mainimage from "../../assets/images/main.png";

import {
  FaWallet,
  FaChartLine,
  FaCoins,
} from "react-icons/fa";

import { MdStorefront } from "react-icons/md";

export default function Hero() {
  return (
    <header
      className="h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url(${mainimage})`,
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-8">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-green-700 mb-6">
            About FarmFriend
          </h1>

          <div className="inline-block bg-green-100 text-green-700 px-5 py-2 rounded-full font-medium">
            🌱 Helping Farmers Manage Their Farms Smarter
          </div>

          <p className="mt-6 text-lg text-gray-700 leading-8">
            Manage expenses, track profits, book mandi slots,
            receive weather updates and make data-driven
            farming decisions—all from one platform.
          </p>

          <button className="mt-8 bg-green-600 text-white px-7 py-3 rounded-lg hover:bg-green-700 transition">
            Get Started
          </button>

          {/* Features */}
          <div className="flex gap-6 mt-12 flex-wrap">

            {/* Expense */}
            <div className="bg-lime-50 shadow-lg rounded-2xl w-36 h-36 flex flex-col justify-center items-center hover:scale-105 transition">
              <FaWallet className="text-4xl text-green-600 mb-3" />
              <p className="font-semibold text-center">
                Expense
                <br />
                Management
              </p>
            </div>

            {/* Profit */}
            <div className="bg-lime-50 shadow-lg rounded-2xl w-36 h-36 flex flex-col justify-center items-center hover:scale-105 transition">
              <FaChartLine className="text-4xl text-green-600 mb-3" />
              <p className="font-semibold text-center">
                Profit
                <br />
                Tracking
              </p>
            </div>

            {/* Mandi */}
            <div className="bg-lime-50 shadow-lg rounded-2xl w-36 h-36 flex flex-col justify-center items-center hover:scale-105 transition">
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
  );
}