import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, ExternalLink, QrCode, Info } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
const ClinicQR = ({ clinicCode, clinicName }) => {
  const qrRef = useRef();

  // The URL patients will visit when they scan
  const checkInUrl = `${window.location.origin}/patient/checkin?code=${clinicCode}`;

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const image = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `QR_CheckIn_${clinicName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="bg-white border border-[#E8DDCB] p-8 rounded-[3rem] shadow-sm flex flex-col items-center relative overflow-hidden group">
      {/* Decorative Branding Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFA800]/5 rounded-bl-[3rem] -z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex items-center gap-2 mb-2">
          <QrCode size={20} className="text-[#FFA800]" />
          <h3 className="font-heading text-2xl text-[#422D0B]">Clinic QR Gateway</h3>
        </div>
        
        <p className="text-xs text-[#967A53] mb-8 text-center px-2 font-medium leading-relaxed">
          Display this at your reception. Patients scan to join the <span className="text-[#422D0B] font-bold">Live Queue</span>.
        </p>

        {/* QR Container with Morning Marigold styling */}
        <div 
          ref={qrRef} 
          className="p-8 bg-[#FFFBF5] rounded-[2.5rem] border-2 border-[#FFA800]/20 mb-8 shadow-inner relative group/qr transition-transform hover:scale-[1.02]"
        >
          <QRCodeCanvas 
            value={checkInUrl} 
            size={200}
            bgColor={"#FFFBF5"} // Parchment
            fgColor={"#422D0B"} // Deep Teak
            level={"H"}         // High error correction
            includeMargin={false}
          />
          {/* Subtle Scan Me Indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/qr:opacity-100 transition-opacity bg-[#422D0B]/5 backdrop-blur-[1px] rounded-[2.5rem]">
             <span className="bg-[#422D0B] text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
               Scan to Test
             </span>
          </div>
        </div>

        {/* Live Link Verification */}
        <div className="w-full bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-4 mb-6 flex items-center justify-between group/link hover:border-[#FFA800] transition-colors">
          <div className="overflow-hidden">
            <p className="text-[8px] font-black uppercase text-[#967A53] mb-1">Target URL</p>
            <p className="text-[10px] text-[#422D0B] font-bold truncate pr-4 italic">
              {checkInUrl.replace('http://', '').replace('https://', '')}
            </p>
          </div>
          <a href={checkInUrl} target="_blank" rel="noreferrer" className="text-[#967A53] hover:text-[#FFA800]">
            <ExternalLink size={14} />
          </a>
        </div>

        <button 
          onClick={downloadQR}
          className="w-full py-4 bg-[#422D0B] text-[#FFFBF5] rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#FFA800] transition-all shadow-xl shadow-[#422D0B]/10 flex items-center justify-center gap-3 active:scale-95"
        >
          <Download size={16} /> Download PNG for Print
        </button>
        
        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#FFFBF5] rounded-full border border-[#E8DDCB]">
           <Info size={12} className="text-[#FFA800]" />
           <p className="text-[9px] font-black uppercase text-[#967A53] tracking-widest">
             Clinic Identity: <span className="text-[#422D0B]">{clinicCode}</span>
           </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicQR;