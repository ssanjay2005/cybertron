import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function Success() {
  const navigate = useNavigate();
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (verifiedRef.current) return;

    const paymentDone = localStorage.getItem("paymentDone");

    if (paymentDone !== "true") {
      navigate("/", { replace: true });
      return;
    }

    verifiedRef.current = true;

    // 🧹 clear AFTER confirmed entry
    localStorage.removeItem("paymentDone");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-10 text-center shadow-[0_0_40px_rgba(0,255,255,0.4)]">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-cyan-400 animate-pulse" />
        </div>

        <h1 className="text-3xl font-bold text-cyan-400 tracking-widest mb-4">
          REGISTRATION SUCCESSFUL
        </h1>

        <p className="text-gray-300 tracking-wide leading-relaxed mb-8">
          Your team registration and payment have been submitted successfully.
          <br />
          <span className="text-cyan-400">Verification is in progress.</span>
        </p>

        <div className="border border-cyan-400/30 rounded-lg p-4 mb-8 text-sm text-gray-400">
          📩 You will be contacted if any verification is required.
          <br />
          🎯 Further event details will be shared soon.
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 border border-cyan-400 text-cyan-400 tracking-widest hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_25px_rgba(0,255,255,0.5)] hover:shadow-[0_0_50px_rgba(0,255,255,0.9)]"
          >
            <ArrowLeft className="w-4 h-4" />
            GO HOME
          </button>
        </div>
      </div>
    </div>
  );
}
