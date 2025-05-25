import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Entry() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [resultClass, setResultClass] = useState("");

  function handleSubmit() {
    setResultClass("");
    if (code === "5987") {
      setResultClass("correct");
      setTimeout(() => {
        navigate("/game");
      }, 2000);
    } else {
      setResultClass("incorrect");
      setTimeout(() => {
        setResultClass("");
      }, 2000);
    }
  }

  return (
    <div className="entry-container">
      <img src="/assets/image/logo.png" alt="Moomoo" />
      <h1>Where did Moomoo go?</h1>
      <div className={`code-container ${resultClass}`}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
