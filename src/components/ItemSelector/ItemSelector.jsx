import React, { useState, useEffect } from "react";
import "./ItemSelector.css";
import fetchItemData from "../../utils/fetchItemData";

const ItemSelector = ({ onClose, onAddItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOptions(null);
    try {
      const result = await fetchItemData(searchTerm);
      if (result.multipleOptions) {
        setOptions(result.options);
      } else {
        onAddItem(result);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to fetch item");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (option) => {
    setLoading(true);
    setError(null);
    try {
      const item = await fetchItemData(option.name, option.versionIndex);
      onAddItem(item);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to fetch item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-overlay">
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for OSRS items..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {options && (
          <div className="options-list">
            <p>Multiple versions found. Please select one:</p>
            {options.map((option, index) => (
              <button key={index} onClick={() => handleOptionSelect(option)}>
                {option.name}
              </button>
            ))}
          </div>
        )}
        <hr className="form-seperator"></hr>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ItemSelector;
