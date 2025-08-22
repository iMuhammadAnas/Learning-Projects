import { useState } from "react";

type Props = {
  data: any;
  update: (fields: any) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function ContactDetails({
  data,
  update,
  onNext,
  onBack,
}: Props) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!data.email.trim() || !data.phone.trim()) {
      setError("All fields are required.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div>
      <h2 className="heading">Contact Details</h2>
      <label>Email:</label>
      <input
        className="input"
        type="email"
        value={data.email}
        onChange={(e) => update({ email: e.target.value })}
      />

      <label>Phone:</label>
      <input
        className="input"
        type="tel"
        value={data.phone}
        onChange={(e) => update({ phone: e.target.value })}
      />

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button className="button" onClick={onBack}>
          Back
        </button>
        <button className="button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
