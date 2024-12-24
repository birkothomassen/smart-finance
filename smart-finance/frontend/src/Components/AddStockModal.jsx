import React, { useState } from "react";

function AddStockModal({ open, onClose, onAddStock }) {
  const [formData, setFormData] = useState({ name: "", price: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData.name && formData.price) {
      onAddStock(formData);
      setFormData({ name: "", price: "" });
      onClose();
    } else {
      alert("Vennligst fyll inn alle felt.");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Legg til aksje</h2>
        <input
          type="text"
          name="name"
          placeholder="Aksjenavn"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Aksjekurs"
          value={formData.price}
          onChange={handleChange}
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit} className="add-button">
            Legg til
          </button>
          <button onClick={onClose} className="cancel-button">
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStockModal;
