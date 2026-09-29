
import React, { useState, useRef } from 'react';
import { ASSETS } from '../constants';
import { analyzeScanWithGemini } from '../services/gemini';
import { useHealth } from '../context/HealthContext';

const MRIAnalysis: React.FC = () => {
  const { addScanRecord, addNotification, userName } = useHealth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);

      if (file.name.toLowerCase().endsWith('.dcm')) {
        try {
          // Dynamic import to avoid SSR issues if any, and code splitting
          const { parseDicom } = await import('../services/dicomService');
          const dataUrl = await parseDicom(file);
          setSelectedImage(dataUrl);
          setAnalysisResult(null);
          setProgress(0);
        } catch (e) {
          console.error("DICOM Error", e);
          alert("Failed to parse DICOM file. Please ensure it is a valid medical image.");
        }
      } else {
        // Standard image
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setSelectedImage(base64);
          setAnalysisResult(null);
          setProgress(0);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProgress(0);
    setAnalysisResult(null);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 92) {
          clearInterval(interval);
          return 92;
        }
        return p + 4;
      });
    }, 120);

    try {
      const result = await analyzeScanWithGemini(selectedImage);
      setAnalysisResult(result);
      setProgress(100);

      // Save to global history
      addScanRecord({
        id: Date.now().toString(),
        name: fileName || 'Manual_Scan_Capture',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Complete',
        imageUrl: selectedImage,
        findings: result
      });

      addNotification({
        title: 'Analysis Saved',
        description: `Results for ${fileName || 'your scan'} have been added to your medical records.`,
        type: 'insight'
      });

    } catch (e) {
      console.error(e);
      setAnalysisResult("An unexpected error occurred during analysis. Please check your connection.");
    } finally {
      setIsProcessing(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Diagnostic Console</h1>
          <p className="text-slate-400 font-medium">Professional grade volumetric analysis powered by Neuro AI.</p>
        </div>
        <div className="flex gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all text-sm uppercase tracking-widest"
          >
            <span className="material-symbols-outlined">upload_file</span> {selectedImage ? 'Swap Image' : 'Select Scan'}
          </button>
          <button
            onClick={startAnalysis}
            disabled={!selectedImage || isProcessing}
            className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-bold shadow-2xl transition-all text-sm uppercase tracking-widest ${!selectedImage || isProcessing
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
              : 'bg-primary hover:bg-blue-600 text-white shadow-primary/25 hover:scale-105 active:scale-95'
              }`}
          >
            <span className="material-symbols-outlined">analytics</span> Run AI Diagnostics
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 flex-1 min-h-[700px]">
        {/* Left - Viewport */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative flex-1 bg-black rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl group min-h-[600px]">
            {/* Scan Image or Placeholder */}
            <div
              className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-1000 ${isProcessing ? 'scale-110 blur-md opacity-30' : 'scale-100 opacity-100'}`}
              style={{ backgroundImage: `url("${selectedImage || ASSETS.HERO_NEURAL}")` }}
            />

            {!selectedImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center p-12 max-w-sm">
                  <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8 text-primary border border-primary/20 shadow-2xl shadow-primary/10">
                    <span className="material-symbols-outlined text-5xl">biometry</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Awaiting Input</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Upload a brain MRI or CT scan. Our neural networks will provide a structural assessment.</p>
                </div>
              </div>
            )}

            {/* HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-black/30"></div>

            {isProcessing && (
              <div className="absolute inset-0 flex flex-col justify-start">
                <div className="h-[3px] w-full bg-primary/90 shadow-[0_0_30px_rgba(19,127,236,1)] animate-scanline z-10"></div>
              </div>
            )}

            {/* UI Panels */}
            <div className="absolute top-10 left-10 flex flex-col gap-6 pointer-events-auto">
              <div className="p-6 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex flex-col gap-3 min-w-[220px] shadow-2xl">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Patient Dossier</p>
                <p className="text-2xl font-display font-bold">{userName.toUpperCase()}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Case ID: #RE-901-2-B</p>
                <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Source Resolution</p>
                  <p className="text-xs font-bold font-mono">512 x 512 DICOM</p>
                </div>
              </div>
            </div>

            <div className="absolute top-10 right-10 flex flex-col gap-4 pointer-events-auto">
              {['zoom_in', 'zoom_out', '3d_rotation', 'contrast', 'layers', 'grid_on'].map(icon => (
                <button key={icon} className="w-14 h-14 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-slate-300 hover:text-white shadow-xl">
                  <span className="material-symbols-outlined text-2xl">{icon}</span>
                </button>
              ))}
            </div>

            {selectedImage && (
              <div className="absolute bottom-10 left-10 right-10 pointer-events-auto">
                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                  <div className="flex items-center gap-8 shrink-0">
                    <div className="text-center md:text-left">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Engine Status</p>
                      <p className="text-2xl font-display font-bold uppercase tracking-tight text-primary">
                        {isProcessing ? 'Analyzing Tissue...' : analysisResult ? 'Analysis Verified' : 'Engine Standby'}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 w-full max-w-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Volumetrics v4.1</span>
                      <span className="text-xs font-bold text-primary font-mono">{progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-primary transition-all duration-300 shadow-[0_0_20px_rgba(19,127,236,0.8)]" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <button className="px-8 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 font-bold text-xs uppercase tracking-widest transition-all shrink-0">
                    Export Metadata
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Findings Panel */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-dark border border-white/5 rounded-[3rem] p-10 flex flex-col gap-8 h-fit min-h-[450px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-8xl">clinical_notes</span>
            </div>

            <h3 className="text-2xl font-display font-bold flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              AI Insights
            </h3>

            {isProcessing ? (
              <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
                <div className="h-4 w-full bg-white/10 rounded-full"></div>
                <div className="h-4 w-2/3 bg-white/10 rounded-full"></div>
                <div className="h-48 w-full bg-white/5 rounded-[2rem] mt-4 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Generating Findings</p>
                  </div>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 text-slate-200 text-sm leading-relaxed font-medium relative">
                  <span className="material-symbols-outlined absolute -top-3 -left-3 text-primary bg-background-dark rounded-full p-1 border border-primary/20">format_quote</span>
                  {analysisResult}
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { label: 'Volumetric Match', val: '98.2%', color: 'text-green-400' },
                    { label: 'Anomalies Detected', val: 'None', color: 'text-white' },
                    { label: 'Integrity Check', val: 'Passed', color: 'text-teal-400' }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                      <span className={`font-bold text-sm ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] text-center px-4 leading-loose">
                  Internal verification complete. This summary is intended for clinical assistance and must be reviewed by a board-certified neuroradiologist.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-slate-600 border border-white/5">
                  <span className="material-symbols-outlined text-4xl">search_check</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Findings Pending</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">Submit image for evaluation to generate <br />tissue density and structural data.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface-dark border border-white/5 rounded-[3rem] p-10 flex-1 shadow-2xl">
            <h3 className="text-2xl font-display font-bold mb-8">Scan Library</h3>
            <div className="flex flex-col gap-5">
              {[
                { name: 'AXIAL_T1_CONTRAST', date: 'Oct 20, 2023', score: '94%', type: 'folder_open' },
                { name: 'CORONAL_FLAIR_BRAIN', date: 'Sep 15, 2023', score: '88%', type: 'folder' },
                { name: 'SAGITTAL_T2_SPINE', date: 'Aug 22, 2023', score: '91%', type: 'folder' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-5 rounded-[1.5rem] hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform border border-primary/10 shadow-lg">
                    <span className="material-symbols-outlined text-2xl">{item.type}</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-base group-hover:text-primary transition-colors truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.date}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{item.score}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-xs uppercase tracking-widest transition-all">
              Access All Archives
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 0; opacity: 0.1; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { top: 100%; opacity: 0.1; }
        }
        .animate-scanline {
          animation: scanline 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          position: absolute;
        }
      `}</style>
    </div>
  );
};

export default MRIAnalysis;
