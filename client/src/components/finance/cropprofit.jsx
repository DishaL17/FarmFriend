export default function cropProfits(){
    return(
       
      <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 mx-3">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
            <FaSeedling className="text-base" />
          </span>
          Crop Profit Analysis
        </h3>

        {cropProfits.length === 0 ? (
          <p className="text-sm text-slate-400 py-2">
            No crop-specific transactions recorded yet. Add transactions associated with your crops to view analytics.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cropProfits.map((cp) => (
              <div
                key={cp.name}
                className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-700 capitalize">
                    🌱 {cp.name}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      cp.profit >= 0
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                  >
                    {cp.profit >= 0 ? "Profit" : "Loss"}
                  </span>
                </div>

                <div className="flex justify-between items-end mt-2">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">
                      Crop Profit
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        cp.profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{cp.profit.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-500 space-y-0.5">
                    <p>Income: <b className="text-green-600">₹{cp.income.toLocaleString("en-IN")}</b></p>
                    <p>Expense: <b className="text-red-500">₹{cp.expense.toLocaleString("en-IN")}</b></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
}