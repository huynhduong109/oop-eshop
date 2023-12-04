import { useState } from "react";
import "../CSS/RangeSlider.css";
import numeral from "numeral";

function RangeSlider({ onChange }) {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  // Đặt các giá trị min, max và step
  const min = 0;
  const max = 50000000;
  const step = 100000;

  return (
    <div className="range-slider">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <span className="range-slider__value">
        {numeral(value).format("0,0")} đ
      </span>
    </div>
  );
}

export default RangeSlider;
