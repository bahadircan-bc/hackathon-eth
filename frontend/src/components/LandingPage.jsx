import React from "react";

import { Link } from "react-router-dom";
import bgimage from "../assets/wiserbg.jpeg";
import logo from "../assets/logo.png";

const FooterElement = () => {
  return (
    <div className="w-full flex flex-row items-center justify-evenly">
      <div>Whitepaper</div>
      <div>Contact Us</div>
      <div>Join The Community</div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div
      class="flex flex-col h-full w-full "
      style={{
      //   background: `radial-gradient(circle at top, #fff 0%, transparent 50%),
      // radial-gradient(circle at bottom, #000 0%, transparent 50%)`,
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) 100%), url(${bgimage})`,
        backgroundSize: "cover"
      }}
    >
      <header class="p-5">
        <nav class="flex justify-between">
          <a href="#" class="text-white opacity-50 font-bold uppercase mb-2">
            WEIR
          </a>
          <a href="#" class="text-white opacity-50 font-bold uppercase mb-2">
            DVON
          </a>
          <a href="#" class="text-white opacity-50 font-bold uppercase mb-2">
            WICE
          </a>
          <a href="#" class="text-white opacity-50 font-bold uppercase mb-2">
            CCODAAT
          </a>
          <a href="#" class="text-white opacity-50 font-bold uppercase mb-2">
            CAJMMGB25
          </a>
        </nav>
      </header>
      <main class="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-[3em] m-0 text-white">WISER</h1>
        <p class="text-[1.2em] mb-5 text-white">THE ESSENCE OF FAIR PLAY</p>
        <p class="text-[#7f8c8d]">
          The Lucinni casino project the lion way ore o clatium capiony.
        </p>
        <Link
          to="plinko"
          class="inline-block px-2 py-5 hover:scale-110 text-white uppercase"
        >
          {<img src={logo} className="w-[200px] aspect-square"/>}
        </Link>
      </main>
      <footer class="flex justify-between p-5">
        <p class="opacity-50 mb-2 text-white">INTRODUCTORY</p>
        <p class="opacity-50 mb-2 text-white">JOIN US NOW</p>
        <p class="opacity-50 mb-2 text-white">INVESTOR INFO</p>
      </footer>
    </div>
  );
}
