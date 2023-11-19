import React from "react";

import { Link } from "react-router-dom";

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
    <div className="w-full overflow-x-hidden overflow-y-scroll flex items-start justify-center">
      <div className="w-4/5 aspect-[9/16] text-white bg-red-500 " style={{
 background: `radial-gradient(ellipse at top, #e66465, transparent),
              radial-gradient(ellipse at bottom, #4d9f0c, transparent)`,
}}>
        <FooterElement />
      </div>
    </div>
  );
}
