import React from 'react';
import { useState } from 'react';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';


export default function Datepicker(props) {


const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

const handleChange = (selection) => {
  setState(selection)
  props.handleChange(selection)
}

const handleClear = () => {
  setState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  props.handleClear()
}
return (
  <div>
  <DateRangePicker
    editableDateInputs={false}
    onChange={item => handleChange([item.selection])}
    // onChange={item => props.handleChange([item.selection])}
    moveRangeOnFirstSelection={false}
    ranges={state}
    staticRanges={[]}
    inputRanges={[]}
    maxDate={new Date()}
  />
  <button className="clear-dates" onClick={handleClear}>Clear Dates</button>

  </div>
)


}
