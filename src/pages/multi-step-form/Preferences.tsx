import { useState } from "react";

type Props = {
  data: any;
  update: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Preferences({ data, update, onNext, onBack }: Props) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!data.preference.trim()) {
      setError("Please select a preference.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div>
      <h2 className="heading">Preferences</h2>
      <label>Choose Preference:</label>
      <select
        value={data.preference}
        onChange={(e) => update({ preference: e.target.value })}
      >
        <option value="">-- Select --</option>
        <option value="React">React</option>
        <option value="Vue">Vue</option>
        <option value="Angular">Angular</option>
      </select>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button className="button" onClick={onBack}>Back</button>
        <button className="button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
