import React, { useState, useRef } from "react";
import JoukkueetTable from "../components/joukkueetTable.tsx";
import "../styles/taulukko.css";

function Joukkueet() {
  // State for storing the selected file
  const [selectedFile, setSelectedFile] = useState(null);

  // Reference for hidden file input
  const fileInputRef = useRef(null);

  // Trigger hidden file input when clicking "Valitse tiedosto"
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Ensure the file is a CSV
      if (!file.name.endsWith(".csv")) {
        alert("Vain CSV-tiedostot ovat sallittuja.");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/upload-endpoint", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Virhe tiedoston latauksessa");
      }

      alert("CSV-tiedosto ladattu onnistuneesti.");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      alert(`Virhe ladattaessa CSV-tiedostoa:\n${error.message}`);
    }
  };

  if (localStorage.getItem("admin") === true) {
    return (
      <div style={{ width: "100%" }}>
        <div className="table-container">
          <h2>Joukkueet</h2>
          <JoukkueetTable />
        </div>
        <div className="upload-container">
          <h2>Lataa CSV</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            {/* Hidden file input */}
            <input
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            {/* Button to open file explorer */}
            <button
              type="button"
              className="upload-button"
              onClick={handleFileButtonClick}
            >
              {selectedFile ? selectedFile.name : "Valitse tiedosto"}
            </button>
            {/* Submit button (enabled only when a file is selected) */}
            <button
              type="submit"
              className="submit-button"
              disabled={!selectedFile}
            >
              Lataa
            </button>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ width: "100%" }}>
        <div className="table-container">
          <h2>Joukkueet</h2>
          <JoukkueetTable />
        </div>
      </div>
    );
  }
}

export default Joukkueet;
