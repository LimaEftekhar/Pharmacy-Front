import React, { useState, useEffect } from "react";
import { getData, patchData } from "../util/index";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import AddMedicine from "../components/AddMedicine";
// import ChallengeDetails from "../components/ChallengeDetails";
// import ChallengeCard from "../components/ChallengeCard";
import Modal from "../components/Modal";
// import FooterCard from "../components/FooterCard";



export default function Dashboard() {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
  async function fetchData() {
    try {
      const res = await getData("/medicines");
      // setMedicines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);


  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading medicines...</p>
        </div>
      ) : (
        <div className="pt-28 px-20 py-12 min-h-screen bg-gray-50">
          <nav className="fixed top-0 left-0 w-full bg-white shadow-[0_0_14px_rgba(0,0,0,0.2)] p-4 flex justify-between items-center z-10">
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

          {/* Create Challenge Button */}
          <div className="flex items-center space-x-20">

            <button
            onClick={() => setModal("add")}
            className="w-full bg-[#2563eb] text-white font-semibold py-3 rounded-2xl hover:bg-blue-600 transition"
          >
            + Add New Medicine
          </button>

           <button
            onClick={() => setModal("add")}
            className="w-full bg-[#2563eb] text-white font-semibold py-3 rounded-2xl hover:bg-blue-600 transition"
          >
            + Add New Medicine
          </button>
          </div>

          
          {/* Modals */}
          {modal === "add" && (
            <Modal onClose={() => setModal(null)}>
              <AddMedicine
                onClose={() => setModal(null)}
                // onMedicineAdded={(newMedicine) => fetchMedicines()}
              />
            </Modal>
          )}
          {/* {modal === "details" && (
            <Modal onClose={() => setModal(null)}>
              <MedicineDetails
                onClose={() => setModal(null)}
                currentUserId={user?._id}
                onDelete={fetchMedicines}
                refetchMedicines={fetchMedicines}
              />
            </Modal>
          )}  */}
          {/* Footer */}
          {/* <FooterCard variant="dashboard" /> */}
        </div>
      )}


      <h1>Dashboard</h1>
    </>
  );
}
