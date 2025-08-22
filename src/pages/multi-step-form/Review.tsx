type Props = {
    data: any;
    onBack: () => void;
    onSubmit: () => void;
  };
  
  export default function Review({ data, onBack, onSubmit }: Props) {
    return (
      <div className="review">
        <h2 className="heading">Review Your Details</h2>
        <ul>
          <li>
            <strong>Name:</strong> {data.name}
          </li>
          <li>
            <strong>Age:</strong> {data.age}
          </li>
          <li>
            <strong>Email:</strong> {data.email}
          </li>
          <li>
            <strong>Phone:</strong> {data.phone}
          </li>
          <li>
            <strong>Preference:</strong> {data.preference}
          </li>
        </ul>
  
        <div className="actions">
          <button className="button" onClick={onBack}>Back</button>
          <button className="button" onClick={onSubmit}>Submit</button>
        </div>
      </div>
    );
  }
  