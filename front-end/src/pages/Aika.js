import React, { useState } from 'react';
import '../styles/aika.css';
import TimeInput from '../components/timeInput.tsx';

function Aika() {
  const [time, setTime] = useState(0);

  function testFunc() {
    console.log("Rasti: ",  document.getElementById('rasti-input').value, " Ryhmä: ",  document.getElementById('ryhmä-input').value, " Aika: ",  time);
  }

  return (
    <div className="aika-container">
      <h2 className='ajan-kirjaus-main-label'>Ajan kirjaus</h2>
      <div className='rasti-input-container'>
        <label className='rasti-label'>Valitse Rasti</label>
        <input id='rasti-input' className='rasti-input' type='number' min={1} max={7} defaultValue={1}></input>
      </div>
      <div className='ryhmä-input-container'>
        <label className='ryhmä-label'>Valitse Ryhmä</label>
        <select id='ryhmä-input' className='ryhmä-input' name='ryhmät' defaultValue={""}>
          <option value="" hidden>Valitse ryhmä...</option>
          <option value="Ryhmä 1">Ryhmä 1</option>
          <option value="Ryhmä 2">Ryhmä 2</option>
        </select>
      </div>
      <div className='aika-tallenus'>
        <div className='aika-label-box'>
          <label className='minuutti-label'>Minuutit</label>
          <label className='sekuntti-label'>Sekunnit</label>
        </div>
        <TimeInput
          value={time}
          onChange={(newTime) => {setTime(newTime)}}
          maxTotalSeconds={360}
        />
        <button className='tallennus' onClick={() => testFunc()}>TALLENNA</button>
      </div>
    </div>
  );
}

export default Aika;
