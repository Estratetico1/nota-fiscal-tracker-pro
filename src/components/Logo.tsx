
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-14">
        <div className="absolute w-12 h-14 rounded-t-full border-4 border-teal-500"></div>
        <div className="absolute bottom-0 left-1/4 w-6 h-7 bg-orange-500"></div>
      </div>
      <div className="text-2xl font-bold">
        <span className="text-teal-500">três</span>
        <span className="text-orange-500 italic">pharma</span>
      </div>
      <span className="block text-xs text-teal-500 font-normal -mt-1">Distribuidora</span>
    </div>
  );
};

export default Logo;
