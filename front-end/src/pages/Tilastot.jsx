import React from "react"
import TilastoTable from "../components/tilastoTable.tsx"
import "../styles/taulukko.css"

function Tilastot() {
  return (
    <div className="table-container">
      <h2>Tilastot</h2>
      <TilastoTable/>
    </div>
  )
}

export default Tilastot