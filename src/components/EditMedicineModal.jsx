import React, { useState } from "react";
import { patchData } from "../util";

export default function EditMedicineModal({ medicine, onClose, onUpdated }) {
  const [form, setForm] = useState({
    medicineCode: medicine.medicineCode,
    name: medicine.name,
    costPrice: medicine.costPrice,
    sellingPrice: medicine.sellingPrice,
    quantity: medicine.quantity,
    expirationDate: medicine.expirationDate.split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await patchData(`/medicines/${medicine._id}`, {
        ...form,
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        quantity: Number(form.quantity),
        expirationDate: new Date(`${form.expirationDate}T00:00:00Z`),
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center min-h-screen z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300"></div>
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/30">
        <div className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-tr from-blue-400/20 via-transparent to-blue-400/20 pointer-events-none"></div>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 text-2xl hover:text-gray-600"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Edit Medicine
        </h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            "medicineCode",
            "name",
            "costPrice",
            "sellingPrice",
            "quantity",
          ].map((field) => (
            <input
              key={field}
              name={field}
              type={
                field.includes("Price") || field === "quantity"
                  ? "number"
                  : "text"
              }
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400"
              placeholder={field.replace(/([A-Z])/g, " $1")}
            />
          ))}
          <input
            type="date"
            name="expirationDate"
            value={form.expirationDate}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
