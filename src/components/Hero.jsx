import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


import IntroVideo from "./IntroVideo";
import LogoReveal from "./LogoReveal";
import BootSequence from "./BootSequence";
import GlitchTitle from "./GlitchTitle";
import EventHighlights from "./EventHighlights";
import SessionsSection from "./SessionsSection";
import RulesSection from "./RulesSection";
import ContactSection from "./ContactSection";
import PerksSection from "./PerksSection";
import Footer from "./Footer";


export default function Hero() {
  const navigate = useNavigate();
  

  // 🔥 FLOW STATES
  const [showIntro, setShowIntro] = useState(true);  // video
  const [showLogo, setShowLogo] = useState(false);  // logo
  const [bootDone, setBootDone] = useState(false);  // hero
  const [active, setActive] = useState(null);
  // 1️⃣ INTRO VIDEO
 
 useEffect(() => {
    const introPlayed = localStorage.getItem("introPlayed");
    if (!introPlayed) {
      setShowIntro(true);   // first visit
    } else {
      setBootDone(true);   // skip intro
    }
  }, []);
 if (showIntro) {
    return (
      <IntroVideo
        onFinish={() => {
          setShowIntro(false);
          setShowLogo(true);
        }}
      />
    );
  }

  // 2️⃣ LOGO
  if (showLogo) {
    return (
      <LogoReveal
        onDone={() => {
          localStorage.setItem("introPlayed", "true"); // 🔥 SAVE FLAG
          setShowLogo(false);
          setBootDone(true);
        }}
      />
    );
  }

  return (
    <section className="relative">

      {/* 3️⃣ BOOT SEQUENCE */}
      {!bootDone && (
        <div className="flex flex-col items-center justify-center pt-32 pb-20">
          <BootSequence onComplete={() => setBootDone(true)} />
        </div>
      )}

      {/* 4️⃣ HERO CONTENT */}
      {bootDone && (
        <>
          <div className="flex flex-col items-center text-center pt-32 pb-20">
            <GlitchTitle text="CYBERTRON CTF 2026" />

            <p className="mt-6 text-gray-400 tracking-[0.3em] text-sm md:text-lg">
              UNLEASH THE MACHINE WITHIN
            </p>

            <div className="mt-12 flex gap-6">
              <button
                onClick={() => {
                  setActive("init");
                  navigate("/register");
                }}
                className={`
                  relative overflow-hidden
                  px-10 py-4
                  border border-cyan-400
                  text-cyan-400 tracking-widest

                  transition-all duration-300 ease-out
                  hover:text-black hover:scale-110
                  hover:bg-cyan-400/80

                  shadow-[0_0_30px_rgba(0,255,255,0.5)]
                  hover:shadow-[0_0_60px_rgba(0,255,255,255,0.9)]
                `}
              >
                <span className="absolute inset-0 bg-cyan-400/40 opacity-0 hover:opacity-100 transition" />

                {active === "init" && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-sweep" />
                )}

                <span className="relative z-10">
                  INITIALIZE REGISTRATION
                </span>
              </button>
            </div>
          </div>

          <EventHighlights />
          <SessionsSection />
          <RulesSection />
          <PerksSection />
          <ContactSection />
          <Footer />
        </>
      )}
    </section>
  );
}
