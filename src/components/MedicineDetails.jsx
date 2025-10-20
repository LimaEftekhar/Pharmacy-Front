import React, { useEffect, useState } from "react";
import { getData, deleteData } from "../util";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditMedicineModal from "./EditMedicineModal.jsx";

export default function MedicineDetails({ onClose }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMedicine, setEditMedicine] = useState(null);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?"))
      return;
    try {
      await deleteData(`/medicines/${id}`);
      setMedicines((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete medicine");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Medicine Details
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading medicines...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : !medicines || medicines.length === 0 ? (
          <p className="text-center text-gray-500">No medicines found.</p>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-gray-200 shadow-inner">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-sm">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">
                    Cost
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">
                    Expires
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {medicines.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{m.medicineCode}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {m.name}
                    </td>
                    <td className="px-4 py-3">${m.costPrice}</td>
                    <td className="px-4 py-3">${m.sellingPrice}</td>
                    <td className="px-4 py-3">{m.quantity}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(m.expirationDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC", // Prevent timezone shift
                      })}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-4">
                      <button
                        onClick={() => setEditMedicine(m)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editMedicine && (
          <EditMedicineModal
            medicine={editMedicine}
            onClose={() => setEditMedicine(null)}
            onUpdated={fetchMedicines}
          />
        )}
      </div>
    </div>
  );
}
