
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-14">
        {/* Formato de cápsula principal */}
        <div className="absolute w-8 h-14 rounded-full border-[3px] border-teal-500"></div>
        
        {/* Linha laranja horizontal no meio */}
        <div className="absolute top-6 left-0 w-8 h-1 bg-orange-500"></div>
        
        {/* Área preenchida abaixo da linha laranja */}
        <div className="absolute top-7 left-0 w-8 h-7 rounded-b-full bg-orange-100"></div>
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
