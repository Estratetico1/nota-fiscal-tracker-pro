
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-10">
        <div className="absolute w-6 h-8 rounded-full border-4 border-teal-500"></div>
        <div className="absolute bottom-0 right-0 w-3 h-5 bg-orange-500 rounded-b-full"></div>
      </div>
      <div className="text-2xl font-bold">
        <span className="text-teal-500">NF</span>
        <span className="text-orange-500">Tracker</span>
        <span className="block text-xs text-teal-500 font-normal">Pro</span>
      </div>
    </div>
  );
};

export default Logo;
