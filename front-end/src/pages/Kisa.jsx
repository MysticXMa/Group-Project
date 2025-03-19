import React, { useState } from "react"
import TimeInput from "../components/timeInput.tsx"
import '../styles/kisa.css'

function Kisa() {

  const [time, setTime] = useState(0);
    
  return (
    <div className="kisa-form-container">
      <h2>Luo kisa</h2>
      <form className="kisa-form">
        <div className="form-section">
            <label>Rastien määrä</label>
            <input type="number" className="rasti-input" min="1"/>
        </div>

        <div className="form-section">
            <label>Maksimi aika</label>
            <TimeInput value={time} onChange={setTime}/>
        </div>
        
        <div className="form-section">
         <button className="submit-button" type="submit">Aloita kisa</button>
        </div>
      </form>
    </div>
  )
}

export default Kisa
