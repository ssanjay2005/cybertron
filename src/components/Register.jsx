import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postJSON } from "../api";


export default function Register() {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [teamName, setTeamName] = useState("");
  const [teamUnique, setTeamUnique] = useState(null);
  const [teamMsg, setTeamMsg] = useState("");
  const [checking, setChecking] = useState(false);

  const [member1, setMember1] = useState({
    name: "",
    college: "",
    email: "",
    phone: "",
  });

  const [member2, setMember2] = useState({
    name: "",
    college: "",
    email: "",
    phone: "",
  });

  // ---------------- DEBOUNCE TIMER ----------------
  const debounceRef = useRef(null);

  // ---------------- API CALL ----------------
const checkTeamUnique = async (name) => {
  if (!name.trim()) return;

  setChecking(true);
  try {
    const data = await postJSON("/check-unique", {
      teamName: name,
    });

    setTeamUnique(data.unique);
    setTeamMsg(data.message);
  } catch {
    setTeamUnique(false);
    setTeamMsg("Server error while checking team");
  }
  setChecking(false);
};

  // ---------------- DEBOUNCED WRAPPER ----------------
  const checkTeamUniqueDebounced = (value) => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      checkTeamUnique(value);
    }, 500);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (teamUnique === false) {
      alert("Team name already registered");
      return;
    }

    if (
      !teamName ||
  !member1.name ||
  !member1.college ||
  !member1.email ||
  !member1.phone ||
  !member2.name ||
  !member2.college ||
  !member2.email ||
  !member2.phone
    ) {
      alert("Please fill all required fields");
      return;
    }

    localStorage.setItem(
      "registrationData",
      JSON.stringify({ teamName, member1, member2 })
    );

    navigate("/payment");
  };

  // ---------------- INPUT STYLE ----------------
  const inputClass =
    "w-full p-3 bg-black/70 border border-cyan-400/30 rounded-lg text-white " +
    "placeholder-gray-400 focus:outline-none focus:border-cyan-400 " +
    "focus:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition";

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          max-w-2xl w-full
          bg-black/60 backdrop-blur-xl
          border border-cyan-400/30
          rounded-2xl
          p-10
          shadow-[0_0_40px_rgba(0,255,255,0.4)]
        "
      >
        <h1 className="text-3xl text-cyan-400 font-bold tracking-widest text-center mb-8">
          TEAM REGISTRATION
        </h1>

        {/* TEAM NAME */}
        <div className="mb-6">
          <input
            className={inputClass}
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => {
              const value = e.target.value;
              setTeamName(value);
              setTeamUnique(null);
              setTeamMsg("");
              checkTeamUniqueDebounced(value);
            }}
            required
          />

          {checking && (
            <p className="text-yellow-400 text-xs mt-2">
              Checking availability...
            </p>
          )}

          {teamUnique === false && (
            <p className="text-red-500 text-xs mt-2">
              ❌ {teamMsg}
            </p>
          )}

          {teamUnique === true && (
            <p className="text-green-400 text-xs mt-2">
              ✅ {teamMsg}
            </p>
          )}
        </div>

        {/* MEMBER 1 */}
        <h2 className="text-cyan-400 tracking-widest mb-3">MEMBER 1</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <input className={inputClass} placeholder="Name"
            value={member1.name}
            onChange={(e) => setMember1({ ...member1, name: e.target.value })}
          />
          <input className={inputClass} placeholder="College"
            value={member1.college}
            onChange={(e) => setMember1({ ...member1, college: e.target.value })}
          />
          <input className={inputClass} placeholder="Email" type="email"
            value={member1.email}
            onChange={(e) => setMember1({ ...member1, email: e.target.value })}
          />
          <input className={inputClass} placeholder="Phone"
            value={member1.phone}
            onChange={(e) => setMember1({ ...member1, phone: e.target.value })}
          />
        </div>

        {/* MEMBER 2<span className="text-gray-400 text-sm">(Optional)</span> */}
        <h2 className="text-cyan-400 tracking-widest mb-3">
          MEMBER 2 
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <input className={inputClass} placeholder="Name"
            value={member2.name}
            onChange={(e) => setMember2({ ...member2, name: e.target.value })}
          />
          <input className={inputClass} placeholder="College"
            value={member2.college}
            onChange={(e) => setMember2({ ...member2, college: e.target.value })}
          />
          <input className={inputClass} placeholder="Email" type="email"
            value={member2.email}
            onChange={(e) => setMember2({ ...member2, email: e.target.value })}
          />
          <input className={inputClass} placeholder="Phone"
            value={member2.phone}
            onChange={(e) => setMember2({ ...member2, phone: e.target.value })}
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={teamUnique === false}
          className="
            w-full py-3 tracking-widest
            border border-cyan-400
            text-cyan-400
            hover:bg-cyan-400 hover:text-black
            transition-all duration-300
            shadow-[0_0_25px_rgba(0,255,255,0.5)]
            hover:shadow-[0_0_50px_rgba(0,255,255,0.9)]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          PROCEED TO PAYMENT
        </button>
      </form>
    </div>
  );
}
