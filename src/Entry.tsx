import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hint({ guessCount }: { guessCount: number }) {
  const offerHint = guessCount >= 5;
  const [showFirstHint, setShowFirstHint] = useState(false);
  const [showSecondHint, setShowSecondHint] = useState(false);
  const [showThirdHint, setShowThirdHint] = useState(false);

  if (!offerHint) {
    return null;
  }

  return (
    <div className="hint-container">
      <p className="hint-trigger" onClick={() => setShowFirstHint(true)}>
        Need a hint?
      </p>
      {showFirstHint && (
        <>
          <p>
            Investigate the missing cat poster. Are you entering the numbers you
            see or the numbers you don't see?
          </p>
          <p className="hint-trigger" onClick={() => setShowSecondHint(true)}>
            Need another hint?
          </p>
        </>
      )}
      {showSecondHint && (
        <>
          <p>
            Where are the missing numbers? Could it be some kind of invisible
            ink?
          </p>
          <p className="hint-trigger" onClick={() => setShowThirdHint(true)}>
            One more hint?
          </p>
        </>
      )}
      {showThirdHint && (
        <p>
          Copy and paste the phone number. Your highlight will reveal what is
          unseen.
        </p>
      )}
    </div>
  );
}

export default function Entry() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [resultClass, setResultClass] = useState("");
  const [guessCount, setGuessCount] = useState(0);

  function handleSubmit() {
    setResultClass("");
    if (code === "4779") {
      setResultClass("correct");
      setTimeout(() => {
        navigate("/game");
      }, 750);
    } else {
      setResultClass("incorrect");
      setTimeout(() => {
        setResultClass("");
      }, 2000);
    }
    setGuessCount((prev) => prev + 1);
  }

  return (
    <div className="page-container">
      <div id="compatibility">
        <p>
          You may need to play from another device. The rest of this game
          requires a keyboard and a wider screen.
        </p>
      </div>
      <img src="/assets/image/logo.png" alt="Moomoo" />
      <h1>Help Moomoo Get Home</h1>
      <p>
        <span>I made a </span>
        <a href="/assets/document/poster.pdf" target="_blank">
          poster
        </a>
        <span> to find my lost cat.</span>
      </p>
      <div className={`code-container ${resultClass}`}>
        <input
          type="text"
          placeholder="Enter the code..."
          maxLength={4}
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
      <Hint guessCount={guessCount} />
    </div>
  );
}
