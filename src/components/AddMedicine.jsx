import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { postData } from "../util/index";
import Select from "react-select";
// import useAuthStore from "../store/useAuthStore";

const AddMedicineModal = ({ onClose, onMedicineAdded }) => {
  // const navigate = useNavigate();
  const [medicineCode, setMedicineCode] = useState("");
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //   const { user: currentUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!medicineCode) {
      setError("Medicine code is required");
      setLoading(false);
      return;
    }
    if (medicineCode.length < 4) {
      setError("Medicie code must be at least 4 characters");
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError("Medicine name is required");
      setLoading(false);
      return;
    }
    if (name.length < 2) {
      setError("Medicie name must be at least 2 characters");
      setLoading(false);
      return;
    }

    if (!costPrice || costPrice < 0) {
      setError("Please enter a cost price greater than 0");
      setLoading(false);
      return;
    }
    if (!sellingPrice || sellingPrice < 0) {
      setError("Please enter selling price greater than 0");
      setLoading(false);
      return;
    }
    if (!quantity || quantity < 0) {
      setError("Please enter quantity greater than 0");
      setLoading(false);
      return;
    }
    if (!expirationDate) {
      setError("Expiration date is required");
      setLoading(false);
      return;
    }

    const today = new Date();
    const expDate = new Date(expirationDate);

    if (isNaN(expDate.getTime())) {
      setError("Invalid expiration date format");
      setLoading(false);
      return;
    }

    if (expDate <= today) {
      setError("Expiration date must be in the future");
      setLoading(false);
      return;
    }

    try {
      const data = {
        medicineCode,
        name,
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        quantity: Number(quantity),
        expirationDate: new Date(`${expirationDate}T00:00:00Z`),
      };
      const res = await postData("/medicines", data);
      console.log(res);
      if (onMedicineAdded) onMedicineAdded(res.medicineCode);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add medicine");
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
          className="absolute top-3 right-4 text-gray-400 text-2xl hover:text-gray-600 transition"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-black text-center mb-2 relative z-10">
          Add a Medicine
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center relative z-10">
            {error}
          </p>
        )}

        <form
          className="space-y-4 relative z-10"
          onSubmit={handleSubmit}
          // noValidate
        >
          {/* Title */}
          <input
            type="text"
            placeholder="Medicine code"
            value={medicineCode}
            onChange={(e) => setMedicineCode(e.target.value)}
            required
            minLength="4"
            maxLength="10"
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm 
                       focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
          />

          <input
            type="text"
            placeholder="Medicine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength="2"
            maxLength="100"
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm 
                       focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
          />

          <input
            type="number"
            placeholder="Cost price"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            required
            minLength="0"
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm 
                       focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
          />

          <input
            type="number"
            placeholder="Selling price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            required
            minLength="0"
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm 
                       focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            minLength="0"
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm 
                       focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
          />

          <input
            type="date"
            placeholder="Expiration date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm 
                       focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-md 
                       hover:bg-blue-700 hover:scale-[1.01] transition disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Medicine"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
