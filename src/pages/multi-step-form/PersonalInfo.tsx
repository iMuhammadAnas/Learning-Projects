import { useState } from "react";

type Props = {
  data: any;
  update: (fields: any) => void;
  onNext: () => void;
};

export default function PersonalInfo({ data, update, onNext }: Props) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!data.name.trim() || !data.age.trim()) {
      setError("All fields are required.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className="personal">
      <h2 className="heading">Personal Info</h2>
      <label>Name:</label>
      <input
        className="input"
        type="text"
        value={data.name}
        onChange={(e) => update({ name: e.target.value })}
      />

      <label>Age:</label>
      <input
        className="input"
        type="number"
        value={data.age}
        onChange={(e) => update({ age: e.target.value })}
      />

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button className="button" disabled>Back</button>
        <button className="button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
