import { ShieldCheck } from "lucide-react";

const DOSTLogo = () => {
  return (
    <div className="flex items-center gap-2 mt-5 mb-2 self-center font-medium">
      <div className="bg-[#0038A8] text-white p-2 rounded-lg shadow-md">
        <ShieldCheck className="size-5" />
      </div>

      <div className="flex flex-col border-l border-slate-300 pl-3">
        <span className="text-sm font-bold text-slate-900 tracking-tighter leading-none">
          DOST-IRAD
        </span>
        <span className="text-[11px] font-medium text-[#0038A8] uppercase tracking-widest">
          QuadThink
        </span>
      </div>
    </div>
  );
};

export default DOSTLogo;
