// src/components/timeInput.tsx
import React from "react";

interface TimeInputProps {
  value: number; // Total time in seconds
  onChange: (totalSeconds: number) => void; // Callback when time changes
  maxTotalSeconds?: number; // Optional maximum allowed time in seconds
}

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  maxTotalSeconds,
}) => {
  // Clamp the value to the maximum allowed time if provided
  const clampedTotal = maxTotalSeconds ? Math.min(value, maxTotalSeconds) : value;

  // Calculate minutes and seconds from total seconds
  const minutes = Math.floor(clampedTotal / 60);
  const seconds = clampedTotal % 60;

  // Calculate maximum allowed minutes and seconds based on maxTotalSeconds
  const maxMinutes = maxTotalSeconds ? Math.floor(maxTotalSeconds / 60) : Infinity;
  const maxSeconds =
    maxTotalSeconds && minutes === maxMinutes ? maxTotalSeconds % 60 : 59;

  // Handle changes to the minutes input
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputMinutes = parseInt(e.target.value, 10) || 0;
    const newTotal = inputMinutes * 60 + seconds;
    onChange(maxTotalSeconds ? Math.min(newTotal, maxTotalSeconds) : newTotal);
  };

  // Handle changes to the seconds input
  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputSeconds = Math.min(parseInt(e.target.value, 10) || 0, maxSeconds); // Ensure seconds don't exceed maxSeconds
    const newTotal = minutes * 60 + inputSeconds;
    onChange(maxTotalSeconds ? Math.min(newTotal, maxTotalSeconds) : newTotal);
  };

  return (
    <div className="time-input">
      <input
        type="number"
        defaultValue={minutes}
        onBlur={handleMinutesChange}
        min={0}
        max={maxMinutes}
        aria-label="Minutes"
      />
      <span>:</span>
      <input
        type="number"
        defaultValue={seconds}
        onChange={(e) => {
            if (e.target.value.length > 2) {
              e.target.value = e.target.value.slice(0, 2); // Limit to 2 characters
            }
        }}
        onBlur={handleSecondsChange}
        min={0}
        max={maxSeconds}
        aria-label="Seconds"
      />
    </div>
  );
};

export default TimeInput;