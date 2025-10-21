import React, { useState, useEffect } from "react";
import { getData } from "../util/index";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import AddMedicine from "../components/AddMedicine";
import MedicineDetails from "../components/MedicineDetails";
import Modal from "../components/Modal";
import FooterCard from "../components/FooterCard";

export default function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null); // "create" | "details" | null

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    return parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const fetchMedicines = async () => {
    try {
      const res = await getData("/medicines");
      setMedicines(res.medicines || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  //get medicines
  const totalMedicines = medicines.length;

  //Normalize to date-only (UTC)
  const toDateOnlyUTC = (date) => {
    const d = new Date(date);
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
  };

  const todayUTC = toDateOnlyUTC(new Date());

  // Expiring soon (within 30 days including today)
  const expiringSoonList = medicines.filter((m) => {
    if (!m.expirationDate) return false;
    const expUTC = toDateOnlyUTC(m.expirationDate);
    const diffDays = Math.floor((expUTC - todayUTC) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  // Already expired (strictly before today)
  const expiredList = medicines.filter((m) => {
    if (!m.expirationDate) return false;
    const expUTC = toDateOnlyUTC(m.expirationDate);
    return expUTC.getTime() < todayUTC.getTime();
  });

  // Counts
  const expiringSoon = expiringSoonList.length;
  const expiredCount = expiredList.length;

  // Low stock
  const lowStock = medicines.filter((m) => m.quantity < 20);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading medicines...</p>
        </div>
      ) : (
        <div className="pt-28 px-20 py-12 min-h-screen bg-gray-50">
          {error && (
            <div className="text-red-600 text-center font-medium mt-4">
              {error}
            </div>
          )}
          {/* Navbar */}
          <nav className="fixed top-0 left-0 w-full bg-white shadow p-4 flex justify-between items-center z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2563eb] text-white font-bold mr-3">
                {getInitials(user?.name || "User")}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Welcome back, {user?.name || "User"}!
                </h1>
                <p className="text-sm text-gray-600">
                  Pharmacy Management System
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-[#2563eb] text-white font-semibold py-2 px-4 rounded-xl hover:bg-blue-600 transition"
            >
              Logout
            </button>
          </nav>

          {/* Stats + Actions container */}
          <div className="max-w-6xl mx-auto flex flex-col gap-10 mt-8">
            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-10">
              <button
                onClick={() => setModal("details")}
                className="flex-1 bg-[#2563eb] text-white font-semibold py-3 rounded-2xl hover:bg-blue-700 transition"
              >
                View Medicine Details
              </button>

              <button
                onClick={() => setModal("add")}
                className="flex-1 bg-[#2563eb] text-white font-semibold py-3 rounded-2xl hover:bg-blue-700 transition"
              >
                + Add New Medicine
              </button>
            </div>

            {/* Statistic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {/* Total Medicines */}
              <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700">
                  Total Medicines
                </h2>
                <p className="text-4xl font-bold text-[#2563eb] mt-2">
                  {totalMedicines}
                </p>
                <p className="text-gray-500 mt-1 text-sm">
                  Number of different medicines in stock
                </p>
              </div>

              {/* Expiring Soon */}
              <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700">
                  Expiring in ≤ 30 days
                </h2>
                <p className="text-4xl font-bold text-red-500 mt-2">
                  {expiringSoon}
                </p>
                <p className="text-gray-500 mt-1 text-sm">
                  Medicines that will expire soon
                </p>
              </div>

              {/* Already Expired */}
              <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700">
                  Already Expired
                </h2>
                <p className="text-4xl font-bold text-gray-500 mt-2">
                  {expiredCount}
                </p>
                <p className="text-gray-500 mt-1 text-sm">
                  Medicines past their expiration date
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {/* Expiring Soon Details */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-red-500 mb-4">
                  Medicines Expiring Soon (≤ 30 days)
                </h2>
                {expiringSoonList.length > 0 ? (
                  <ul className="space-y-2">
                    {expiringSoonList.map((m) => (
                      <li
                        key={m._id}
                        className="flex justify-between items-center border-b pb-2 text-gray-700"
                      >
                        <span className="font-medium">{m.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(m.expirationDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC", // Prevent timezone shift
                            },
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No medicines expiring soon</p>
                )}
              </div>

              {/* Low Stock Details */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-yellow-600 mb-4">
                  Medicines Low in Stock (&lt; 20)
                </h2>
                {lowStock.length > 0 ? (
                  <ul className="space-y-2">
                    {lowStock.map((m) => (
                      <li
                        key={m._id}
                        className="flex justify-between items-center border-b pb-2 text-gray-700"
                      >
                        <span className="font-medium">{m.name}</span>
                        <span className="text-sm text-gray-500">
                          Qty: {m.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No medicines low in stock</p>
                )}
              </div>
            </div>
          </div>

          {/* Modals */}
          {modal === "add" && (
            <Modal onClose={() => setModal(null)}>
              <AddMedicine
                onClose={() => {
                  setModal(null);
                  fetchMedicines();
                }}
                onUpdated={fetchMedicines}
              />
            </Modal>
          )}

          {modal === "details" && (
            <Modal onClose={() => setModal(null)}>
              <MedicineDetails
                onClose={() => setModal(null)}
                onUpdated={fetchMedicines}
              />
            </Modal>
          )}
          {/* Footer */}
          <FooterCard />
        </div>
      )}
    </>
  );
}
