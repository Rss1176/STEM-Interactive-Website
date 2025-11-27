import React, { useState, useEffect, useRef } from 'react';
import { Code, Monitor, Maximize2, Minimize2, Image as ImageIcon, BookOpen, Zap, Trophy, ChevronLeft, ChevronRight, Download, RefreshCw, Info, Edit3, AlertTriangle, X, Check } from 'lucide-react';

// --- Components ---

const AutoWidthInput = ({ value, onChange, type = "text", placeholder, className, minWidth = "40px" }) => {
  const [width, setWidth] = useState(minWidth);
  const spanRef = useRef(null);

  useEffect(() => {
    if (spanRef.current) {
      setWidth(`${Math.max(spanRef.current.offsetWidth + 35, parseInt(minWidth))}px`); 
    }
  }, [value, placeholder, minWidth]);

  return (
    <div className="inline-block relative group align-middle">
      <span ref={spanRef} className="absolute opacity-0 pointer-events-none whitespace-pre font-mono text-sm px-2">
        {value || placeholder}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: width }}
        className={`
            bg-indigo-500/20 text-yellow-300 
            border-2 border-dashed border-yellow-500/50 
            hover:border-yellow-400 hover:bg-indigo-500/30
            focus:border-solid focus:border-yellow-400 focus:bg-indigo-600/50 focus:shadow-[0_0_15px_rgba(250,204,21,0.3)]
            outline-none px-2 py-0.5 rounded mx-1 
            transition-all duration-200 font-bold font-mono text-sm 
            placeholder:text-yellow-500/30
            ${className}
        `}
      />
    </div>
  );
};

const StyledSelect = ({ value, onChange, options }) => (
    <div className="inline-block relative group align-middle">
        <select 
            value={value} 
            onChange={onChange} 
            className="
                appearance-none cursor-pointer
                bg-indigo-500/20 text-yellow-300 
                border-2 border-dashed border-yellow-500/50 
                hover:border-yellow-400 hover:bg-indigo-500/30
                focus:border-solid focus:border-yellow-400 focus:bg-indigo-600/50
                outline-none pl-3 pr-8 py-0.5 rounded mx-1 
                transition-all duration-200 font-bold font-mono text-sm
            "
        >
            {options.map(opt => (
                <option key={opt.val} value={opt.val} className="bg-slate-800 text-white">
                    {opt.label || opt.val}
                </option>
            ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500/50 text-[10px]">▼</div>
    </div>
);

const LevelBadge = ({ level }) => {
  const colors = {
    basic: "bg-green-900 text-green-200 border-green-700",
    intermediate: "bg-yellow-900 text-yellow-200 border-yellow-700",
    advanced: "bg-red-900 text-red-200 border-red-700"
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold ml-2 ${colors[level] || ""}`}>
      {level}
    </span>
  );
};

const CSSProp = ({ name, help }) => (
  <span className="group relative cursor-help inline-block mr-1">
    <span className="text-blue-300 hover:text-white transition-colors border-b border-dotted border-blue-300/30">{name}</span>
    <span className="absolute left-0 -top-10 w-max max-w-[200px] bg-slate-800 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-600">
      {help}
    </span>
  </span>
);

const DEFAULT_SITE_DATA = {
    navTitle: "My Awesome Site",
    navColor: "#3b82f6",
    bannerTitle: "Hello World!",
    bannerSubtitle: "I am learning to code web pages.",
    bannerBgColor: "#1e293b",
    bannerTextColor: "#ffffff",
    infoTitle: "About Me",
    infoText: "I love science and technology.",
    showImage: "yes",
    imageCount: "1",
    bannerTextAlign: "center",
    infoBorderRadius: "12",
    infoBorderStyle: "solid", 
    infoBorderColor: "#dddddd", 
    infoBorderWidth: "1", 
    fontFamily: "sans-serif",
    bannerFontSize: "48", 
    infoFontWeight: "normal", 
    infoPadding: "20",
    infoWidth: "600", 
    infoShadow: "none", 
    bannerHeight: "300",
    bannerMarginBottom: "40",
    bannerLetterSpacing: "0", 
    infoRotation: "0", 
    imageSrc: "https://via.placeholder.com/150",
    imageSrc2: "https://via.placeholder.com/150/blue",
    imageSrc3: "https://via.placeholder.com/150/red",
};

export default function App() {
  const [difficulty, setDifficulty] = useState('basic'); 
  const [activeTab, setActiveTab] = useState('editor'); 
  const [showRawCode, setShowRawCode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [showResetConfirm, setShowResetConfirm] = useState(false); 

  const [siteData, setSiteData] = useState(() => {
    const savedData = localStorage.getItem('dxc_site_data');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("Failed to parse saved data", error);
        return DEFAULT_SITE_DATA;
      }
    }
    return DEFAULT_SITE_DATA;
  });

  useEffect(() => {
    localStorage.setItem('dxc_site_data', JSON.stringify(siteData));
  }, [siteData]);

  const updateData = (key, value) => setSiteData(prev => ({ ...prev, [key]: value }));
  
  const confirmReset = () => { 
      setSiteData({ ...DEFAULT_SITE_DATA }); 
      setShowResetConfirm(false); 
  };

  const generateRawHTML = () => {
    const renderImages = () => {
        let imgs = `<img src="${siteData.imageSrc}" class="gallery-img" />`;
        if (parseInt(siteData.imageCount) >= 2) imgs += `\n    <img src="${siteData.imageSrc2}" class="gallery-img" />`;
        if (parseInt(siteData.imageCount) >= 3) imgs += `\n    <img src="${siteData.imageSrc3}" class="gallery-img" />`;
        return parseInt(siteData.imageCount) > 1 ? `<div class="gallery">\n    ${imgs}\n    </div>` : imgs;
    };

    const galleryCSS = parseInt(siteData.imageCount) > 1 ? `
    .gallery { display: flex; gap: 10px; margin-top: 15px; justify-content: center; }
    .gallery-img { width: 32%; border-radius: 8px; }` : `
    .gallery-img { max-width: 100%; margin-top: 15px; border-radius: 8px; }`;

    return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; font-family: ${siteData.fontFamily}; background-color: #f8fafc; }
    .top-bar { background-color: ${siteData.navColor}; padding: 20px; color: white; }
    .main-banner { background-color: ${siteData.bannerBgColor}; color: ${siteData.bannerTextColor}; padding: 50px; text-align: ${siteData.bannerTextAlign}; height: ${siteData.bannerHeight}px; margin-bottom: ${siteData.bannerMarginBottom}px; display: flex; flex-direction: column; justify-content: center; }
    .main-banner h1 { font-size: ${siteData.bannerFontSize}px; letter-spacing: ${siteData.bannerLetterSpacing}px; margin: 0 0 10px 0; }
    .info-box { background-color: white; border: ${siteData.infoBorderWidth}px ${siteData.infoBorderStyle} ${siteData.infoBorderColor}; padding: ${siteData.infoPadding}px; border-radius: ${siteData.infoBorderRadius}px; margin: 0 auto 40px auto; max-width: ${siteData.infoWidth}px; box-shadow: ${siteData.infoShadow}; font-weight: ${siteData.infoFontWeight}; transform: rotate(${siteData.infoRotation}deg); }
    ${galleryCSS}
  </style>
</head>
<body>
  <nav class="top-bar"><h1>${siteData.navTitle}</h1></nav>
  <div class="main-banner"><h1>${siteData.bannerTitle}</h1><p>${siteData.bannerSubtitle}</p></div>
  <div class="info-box"><h2>${siteData.infoTitle}</h2><p>${siteData.infoText}</p>${siteData.showImage === 'yes' ? renderImages() : ''}</div>
</body>
</html>`;
  };

  const showField = (reqLevel) => {
    const levels = ['basic', 'intermediate', 'advanced'];
    return levels.indexOf(difficulty) >= levels.indexOf(reqLevel);
  };

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden">
      <header className="bg-slate-800 border-b border-slate-700 p-3 flex justify-between items-center shadow-lg z-10 shrink-0 h-16 flex-none">
        <div className="flex items-center gap-3">
          {/* Logo removed from header, now in sidebar */}
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">DXC Website Builder</h1>
            <div className="flex items-center gap-2">
               <p className="text-xs text-slate-400">STEM Ambassador Module</p>
               <LevelBadge level={difficulty} />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setShowResetConfirm(true)} className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-md transition-colors text-sm font-medium" title="Reset all code to defaults">
            <RefreshCw size={14} /><span className="hidden sm:inline">Reset</span>
          </button>
          <button onClick={() => setShowRawCode(!showRawCode)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-sm font-medium">
            <Code size={16} />{showRawCode ? "Back" : "View Real Code"}
          </button>
          <div className="md:hidden flex bg-slate-700 rounded-md overflow-hidden">
            <button onClick={() => setActiveTab('editor')} className={`p-2 ${activeTab === 'editor' ? 'bg-blue-600' : ''}`}><Code size={18} /></button>
            <button onClick={() => setActiveTab('preview')} className={`p-2 ${activeTab === 'preview' ? 'bg-blue-600' : ''}`}><Monitor size={18} /></button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <div className={`w-20 ${isSidebarOpen ? 'md:w-64' : 'md:w-20'} bg-slate-900 border-r border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden`}>
            
            {/* --- LOGO SECTION --- */}
            <div className="h-16 flex items-center justify-center p-3 border-b border-slate-800 shrink-0 bg-slate-900">
                {/* Mobile & Collapsed: Vertical Logo */}
                <img 
                    src="DXC Logo_Vertical_White RGB.png" 
                    alt="DXC Logo" 
                    className={`h-full w-auto object-contain ${isSidebarOpen ? 'md:hidden' : 'block'}`} 
                />
                
                {/* Desktop Expanded: Horizontal Logo */}
                <img 
                    src="DXC Logo Horiz_White RGB.png" 
                    alt="DXC Logo" 
                    className={`h-full w-auto object-contain hidden ${isSidebarOpen ? 'md:block' : ''}`} 
                />
            </div>

            <div className="p-4 border-b border-slate-800 flex justify-between items-center h-[53px] flex-none">
                <span className={`text-xs font-bold text-slate-500 uppercase tracking-wider hidden ${isSidebarOpen ? 'md:block' : ''}`}>Difficulty</span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-white hidden md:block p-1 rounded hover:bg-slate-800">
                   {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
                <span className="md:hidden text-xs font-bold text-slate-500 mx-auto">LVL</span>
            </div>
            <div className="flex-1 flex flex-col p-2 gap-2 overflow-hidden">
                {['basic', 'intermediate', 'advanced'].map((level) => (
                    <button key={level} onClick={() => setDifficulty(level)} className={`flex items-center gap-3 p-3 rounded-lg transition-all text-left group relative overflow-hidden ${difficulty === level ? 'bg-blue-900/20 border border-blue-800/50' : 'hover:bg-slate-800 border border-transparent'}`}>
                        {difficulty === level && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>}
                        <div className={`p-2 rounded-md shrink-0 transition-colors ${difficulty === level ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 group-hover:text-blue-400'}`}>
                            {level === 'basic' && <BookOpen size={20} />}
                            {level === 'intermediate' && <Zap size={20} />}
                            {level === 'advanced' && <Trophy size={20} />}
                        </div>
                        <div className={`hidden ${isSidebarOpen ? 'md:block' : 'md:hidden'}`}>
                            <div className={`font-bold capitalize ${difficulty === level ? 'text-blue-400' : 'text-slate-300'}`}>{level}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {!isFullScreen && (
            <div className={`flex-1 flex flex-col border-r border-slate-700 bg-[#1e1e1e] transition-all duration-300 ${activeTab === 'editor' ? 'block' : 'hidden md:flex'} overflow-hidden`}>
                <div className="p-2 bg-[#252526] text-xs text-slate-400 uppercase tracking-wider font-bold border-b border-[#333] flex justify-between items-center z-20 shadow-md shrink-0">
                    <div className="flex items-center gap-2"><span className="text-blue-400">●</span><span>index.html</span></div>
                    <div className="flex items-center gap-2 text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        <Edit3 size={10} className="text-yellow-400"/><span className="text-yellow-100/70">Fill in the dashed boxes!</span>
                    </div>
                </div>
                <div className="flex flex-1 overflow-y-auto min-h-0">
                    <div className="hidden sm:flex flex-col text-right pr-4 pt-6 pb-6 text-slate-600 font-mono text-sm select-none bg-[#1e1e1e] w-12 border-r border-slate-800 shrink-0">
                        {Array.from({length: 45}).map((_, i) => (<div key={i} className="h-[28px] leading-[28px]">{i + 1}</div>))}
                    </div>
                    <div className="p-6 font-mono text-sm md:text-base leading-[28px] flex-1">
                        <div className="text-green-600/80 mb-6 italic pl-2 border-l-2 border-green-900/50">
                            {`<!-- MODE: ${difficulty.toUpperCase()} -->`} <br/>{`<!-- TIP: Look for the dashed boxes to edit code -->`}
                        </div>
                        <div className="mb-8"><span className="text-blue-400">{'<style>'}</span>
                        <div className="pl-6 border-l border-slate-800 ml-1.5 space-y-4">
                            {showField('intermediate') && (
                                <div className="hover:bg-slate-800/50 -ml-2 pl-2 rounded"><span className="text-yellow-300">body</span> {'{'} <br/>&nbsp;&nbsp;<CSSProp name="font-family" help="The style of the text" />: <StyledSelect value={siteData.fontFamily} onChange={(e) => updateData('fontFamily', e.target.value)} options={[{val: "sans-serif", label: "Arial (Modern)"},{val: "serif", label: "Times New Roman (Fancy)"},{val: "monospace", label: "Courier (Coding)"}]} />;<br/>{'}'}</div>
                            )}
                            <div className="hover:bg-slate-800/50 -ml-2 pl-2 rounded"><span className="text-yellow-300">.top-bar</span> {'{'} <br/>&nbsp;&nbsp;<CSSProp name="background-color" help="Change the background color of the top bar" />: <div className="inline-flex items-center gap-2 ml-1 relative top-1"><input type="color" value={siteData.navColor} onChange={(e) => updateData('navColor', e.target.value)} className="w-6 h-6 bg-transparent cursor-pointer border-2 border-dashed border-yellow-500/50 rounded hover:border-yellow-400" /><span className="text-pink-400">"{siteData.navColor}"</span>;</div><br/>{'}'}</div>
                            <div className="hover:bg-slate-800/50 -ml-2 pl-2 rounded"><span className="text-yellow-300">.main-banner</span> {'{'} <br/>&nbsp;&nbsp;<CSSProp name="background-color" help="Change the background color of the big banner" />: <div className="inline-flex items-center gap-2 ml-1 relative top-1"><input type="color" value={siteData.bannerBgColor} onChange={(e) => updateData('bannerBgColor', e.target.value)} className="w-6 h-6 bg-transparent cursor-pointer border-2 border-dashed border-yellow-500/50 rounded hover:border-yellow-400" /><span className="text-pink-400">"{siteData.bannerBgColor}"</span>;</div><br/>&nbsp;&nbsp;<CSSProp name="color" help="Change the text color" />: <StyledSelect value={siteData.bannerTextColor} onChange={(e) => updateData('bannerTextColor', e.target.value)} options={[{val: "#ffffff", label: "white"},{val: "#000000", label: "black"},{val: "#ff0000", label: "red"},{val: "#fbbf24", label: "gold"},]} />;
                            {showField('intermediate') && (<><br/>&nbsp;&nbsp;<CSSProp name="text-align" help="Align text to Left, Center or Right" />: <StyledSelect value={siteData.bannerTextAlign} onChange={(e) => updateData('bannerTextAlign', e.target.value)} options={[{val: "center", label: "center"},{val: "left", label: "left"},{val: "right", label: "right"},]} />;</>)}
                            {showField('advanced') && (<><br/>&nbsp;&nbsp;<CSSProp name="height" help="Make the banner taller or shorter" />: <AutoWidthInput value={siteData.bannerHeight} onChange={(e) => updateData('bannerHeight', e.target.value)} type="number" /><span className="text-pink-400">px</span>;<br/>&nbsp;&nbsp;<CSSProp name="margin-bottom" help="Space below the banner" />: <AutoWidthInput value={siteData.bannerMarginBottom} onChange={(e) => updateData('bannerMarginBottom', e.target.value)} type="number" /><span className="text-pink-400">px</span>;</>)}<br/>{'}'}</div>
                            {showField('intermediate') && (<div className="hover:bg-slate-800/50 -ml-2 pl-2 rounded"><span className="text-yellow-300">.main-banner h1</span> {'{'} <br/>&nbsp;&nbsp;<CSSProp name="font-size" help="How big the text is" />: <AutoWidthInput value={siteData.bannerFontSize} onChange={(e) => updateData('bannerFontSize', e.target.value)} type="number" /><span className="text-pink-400">px</span>;
                            {showField('advanced') && (<><br/>&nbsp;&nbsp;<CSSProp name="letter-spacing" help="Space between letters" />: <AutoWidthInput value={siteData.bannerLetterSpacing} onChange={(e) => updateData('bannerLetterSpacing', e.target.value)} type="number" /><span className="text-pink-400">px</span>;</>)}<br/>{'}'}</div>)}
                            <div className="hover:bg-slate-800/50 -ml-2 pl-2 rounded"><span className="text-yellow-300">.info-box</span> {'{'} <br/>
                            {showField('intermediate') && (<>&nbsp;&nbsp;<CSSProp name="border-style" help="Type of border line" />: <StyledSelect value={siteData.infoBorderStyle} onChange={(e) => updateData('infoBorderStyle', e.target.value)} options={[{val: "solid", label: "solid"},{val: "dashed", label: "dashed"},{val: "dotted", label: "dotted"},{val: "none", label: "none"},]} />;<br/>&nbsp;&nbsp;<CSSProp name="border-color" help="Color of the border" />: <div className="inline-flex items-center gap-2 ml-1 relative top-1"><input type="color" value={siteData.infoBorderColor} onChange={(e) => updateData('infoBorderColor', e.target.value)} className="w-6 h-6 bg-transparent cursor-pointer border-2 border-dashed border-yellow-500/50 rounded hover:border-yellow-400" /><span className="text-pink-400">"{siteData.infoBorderColor}"</span>;</div><br/>&nbsp;&nbsp;<CSSProp name="border-radius" help="Round the corners of the box" />: <AutoWidthInput value={siteData.infoBorderRadius} onChange={(e) => updateData('infoBorderRadius', e.target.value)} type="number" /><span className="text-pink-400">px</span>;<br/>&nbsp;&nbsp;<CSSProp name="font-weight" help="Thickness of the text" />: <StyledSelect value={siteData.infoFontWeight} onChange={(e) => updateData('infoFontWeight', e.target.value)} options={[{val: "normal", label: "normal"},{val: "bold", label: "bold"},{val: "100", label: "thin"},{val: "900", label: "extra bold"},]} />;<br/></>)}
                            {showField('advanced') && (<>&nbsp;&nbsp;<CSSProp name="max-width" help="How wide the box can get" />: <AutoWidthInput value={siteData.infoWidth} onChange={(e) => updateData('infoWidth', e.target.value)} type="number" /><span className="text-pink-400">px</span>;<br/>&nbsp;&nbsp;<CSSProp name="box-shadow" help="Add a shadow effect" />: <StyledSelect value={siteData.infoShadow} onChange={(e) => updateData('infoShadow', e.target.value)} options={[{val: "none", label: "none"},{val: "0 4px 6px -1px rgb(0 0 0 / 0.1)", label: "soft shadow"},{val: "10px 10px 0px #000", label: "hard shadow"},]} />;<br/>&nbsp;&nbsp;<CSSProp name="padding" help="Space inside the box" />: <AutoWidthInput value={siteData.infoPadding} onChange={(e) => updateData('infoPadding', e.target.value)} type="number" /><span className="text-pink-400">px</span>;<br/>&nbsp;&nbsp;<CSSProp name="transform" help="Rotate the box!" />: <span className="text-blue-300">rotate(</span><AutoWidthInput value={siteData.infoRotation} onChange={(e) => updateData('infoRotation', e.target.value)} type="number" className="min-w-[40px]" /><span className="text-pink-400">deg</span><span className="text-blue-300">)</span>;<br/></>)}
                            {'}'}</div>
                            {parseInt(siteData.imageCount) > 1 && (<div className="hover:bg-slate-800/50 -ml-2 pl-2 rounded opacity-70 select-none"><span className="text-slate-500 italic">// Auto-generated gallery styles</span><br/><span className="text-yellow-300">.gallery</span> {'{'} <br/>&nbsp;&nbsp;<span className="text-blue-300">display</span>: <span className="text-pink-400">flex</span>;<br/>&nbsp;&nbsp;<span className="text-blue-300">gap</span>: <span className="text-pink-400">10px</span>;<br/>{'}'}</div>)}
                        </div><span className="text-blue-400">{'</style>'}</span></div>
                        <div><span className="text-blue-400">{'<body>'}</span>
                        <div className="pl-6 border-l border-slate-800 ml-1.5 space-y-4">
                            <div className="hover:bg-slate-800/50 -ml-2 pl-2 rounded"><span className="text-slate-500">{'<!-- Navigation -->'}</span><br/><span className="text-blue-400">{'<nav'}</span> <span className="text-blue-300">class</span>=<span className="text-orange-400">"top-bar"</span><span className="text-blue-400">{'>'}</span><br/>&nbsp;&nbsp;<span className="text-blue-400">{'<h1>'}</span><AutoWidthInput value={siteData.navTitle} onChange={(e) => updateData('navTitle', e.target.value)} /><span className="text-blue-400">{'</h1>'}</span><br/><span className="text-blue-400">{'</nav>'}</span></div>
                            <div className="hover:bg-slate-800/50 -ml-2 pl-2 rounded"><span className="text-slate-500">{'<!-- Hero Banner -->'}</span><br/><span className="text-blue-400">{'<div'}</span> <span className="text-blue-300">class</span>=<span className="text-orange-400">"main-banner"</span><span className="text-blue-400">{'>'}</span><br/>&nbsp;&nbsp;<span className="text-blue-400">{'<h1>'}</span><AutoWidthInput value={siteData.bannerTitle} onChange={(e) => updateData('bannerTitle', e.target.value)} className="font-bold" /><span className="text-blue-400">{'</h1>'}</span><br/>&nbsp;&nbsp;<span className="text-blue-400">{'<p>'}</span><AutoWidthInput value={siteData.bannerSubtitle} onChange={(e) => updateData('bannerSubtitle', e.target.value)} className="italic text-slate-400" /><span className="text-blue-400">{'</p>'}</span><br/><span className="text-blue-400">{'</div>'}</span></div>
                            <div className="hover:bg-slate-800/50 -ml-2 pl-2 rounded"><span className="text-slate-500">{'<!-- Content Card -->'}</span><br/><span className="text-blue-400">{'<div'}</span> <span className="text-blue-300">class</span>=<span className="text-orange-400">"info-box"</span><span className="text-blue-400">{'>'}</span><br/>&nbsp;&nbsp;<span className="text-blue-400">{'<h2>'}</span><AutoWidthInput value={siteData.infoTitle} onChange={(e) => updateData('infoTitle', e.target.value)} /><span className="text-blue-400">{'</h2>'}</span><br/>&nbsp;&nbsp;<span className="text-blue-400">{'<p>'}</span><AutoWidthInput value={siteData.infoText} onChange={(e) => updateData('infoText', e.target.value)} /><span className="text-blue-400">{'</p>'}</span><br/>&nbsp;&nbsp;<span className="text-purple-400">show_image</span> = <StyledSelect value={siteData.showImage} onChange={(e) => updateData('showImage', e.target.value)} options={[{val: "yes", label: "yes"},{val: "no", label: "no"},]} /><br/>
                            {siteData.showImage === 'yes' && (<div className="ml-4 mt-2 p-3 border-2 border-dashed border-yellow-500/30 rounded bg-slate-800/40 relative"><div className="absolute -top-3 left-3 bg-[#1e1e1e] px-2 text-xs text-yellow-500 font-bold">Gallery Settings</div><div className="flex items-center gap-2 mb-2 mt-1"><span className="text-slate-400 text-xs">{'// Number of images:'}</span><StyledSelect value={siteData.imageCount} onChange={(e) => updateData('imageCount', e.target.value)} options={[{val: "1", label: "1"},{val: "2", label: "2"},{val: "3", label: "3"},]} /></div><div className="mb-2"><span className="text-blue-400">{'<img'}</span> <span className="text-blue-300">src</span>=<span className="text-orange-400">"</span><AutoWidthInput value={siteData.imageSrc} onChange={(e) => updateData('imageSrc', e.target.value)} className="text-orange-400 min-w-[150px]" placeholder="https://..." /><span className="text-orange-400">"</span><span className="text-blue-400">{' />'}</span></div>{parseInt(siteData.imageCount) >= 2 && (<div className="mb-2"><span className="text-blue-400">{'<img'}</span> <span className="text-blue-300">src</span>=<span className="text-orange-400">"</span><AutoWidthInput value={siteData.imageSrc2} onChange={(e) => updateData('imageSrc2', e.target.value)} className="text-orange-400 min-w-[150px]" placeholder="https://..." /><span className="text-orange-400">"</span><span className="text-blue-400">{' />'}</span></div>)}{parseInt(siteData.imageCount) >= 3 && (<div className="mb-2"><span className="text-blue-400">{'<img'}</span> <span className="text-blue-300">src</span>=<span className="text-orange-400">"</span><AutoWidthInput value={siteData.imageSrc3} onChange={(e) => updateData('imageSrc3', e.target.value)} className="text-orange-400 min-w-[150px]" placeholder="https://..." /><span className="text-orange-400">"</span><span className="text-blue-400">{' />'}</span></div>)}</div>)}<span className="text-blue-400">{'</div>'}</span></div>
                        </div><span className="text-blue-400">{'</body>'}</span></div>
                    </div>
                </div>
            </div>
        )}

        <div className={`flex-1 bg-slate-200 flex flex-col overflow-hidden relative ${activeTab === 'preview' ? 'block' : 'hidden md:flex'}`}>
           <div className="p-2 bg-white border-b border-slate-300 flex justify-between items-center shadow-sm shrink-0 h-10 z-10">
            <div className="flex items-center gap-2"><div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div><div className="bg-slate-100 text-slate-500 px-4 py-0.5 rounded text-[10px] w-48 text-center border border-slate-200 flex items-center justify-center gap-2 select-none">localhost:3000</div></div>
            <div className="flex items-center gap-2"><button onClick={() => setIsFullScreen(!isFullScreen)} className="text-slate-400 hover:text-blue-600 transition-colors p-1 hover:bg-slate-100 rounded" title={isFullScreen ? "Exit Full Screen" : "Full Screen Preview"}>{isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button></div>
          </div>
          <div className="flex-1 overflow-hidden bg-white">
             <nav style={{ backgroundColor: siteData.navColor }} className="p-6 text-white shadow-md transition-all duration-500"><h1 className="text-2xl font-bold">{siteData.navTitle || "Untitled Site"}</h1></nav>
             <div style={{ backgroundColor: siteData.bannerBgColor, color: siteData.bannerTextColor, textAlign: siteData.bannerTextAlign, height: showField('advanced') ? `${siteData.bannerHeight}px` : 'auto', marginBottom: showField('advanced') ? `${siteData.bannerMarginBottom}px` : '0px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '50px' }} className="transition-all duration-500">
                <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: siteData.fontFamily, fontSize: `${siteData.bannerFontSize}px`, letterSpacing: `${siteData.bannerLetterSpacing}px` }}>{siteData.bannerTitle || "Headline"}</h1>
                <p className="text-xl opacity-90" style={{ fontFamily: siteData.fontFamily }}>{siteData.bannerSubtitle}</p>
             </div>
             <div className="w-full px-4">
                <div className="transition-all duration-500 bg-white" style={{ borderRadius: showField('intermediate') ? `${siteData.infoBorderRadius}px` : '0px', padding: showField('advanced') ? `${siteData.infoPadding}px` : '20px', borderStyle: showField('intermediate') ? siteData.infoBorderStyle : 'solid', borderWidth: showField('intermediate') ? `${siteData.infoBorderWidth}px` : '1px', borderColor: showField('intermediate') ? siteData.infoBorderColor : '#ddd', maxWidth: showField('advanced') ? `${siteData.infoWidth}px` : '600px', margin: '0 auto 40px auto', boxShadow: showField('advanced') ? siteData.infoShadow : 'none', fontWeight: showField('intermediate') ? siteData.infoFontWeight : 'normal', transform: showField('advanced') ? `rotate(${siteData.infoRotation}deg)` : 'none' }}>
                    <div className="flex flex-col gap-6 items-center">
                        <div className="flex-1 text-center"><h2 className="text-2xl font-bold text-slate-800 mb-4" style={{ fontFamily: siteData.fontFamily }}>{siteData.infoTitle}</h2><p className="text-slate-600 leading-relaxed" style={{ fontFamily: siteData.fontFamily }}>{siteData.infoText}</p></div>
                        {siteData.showImage === 'yes' && (<div className={`shrink-0 w-full ${parseInt(siteData.imageCount) > 1 ? 'grid grid-cols-2 md:grid-cols-3 gap-4 mt-4' : 'flex justify-center'}`}><img src={siteData.imageSrc} className={`rounded shadow-sm object-cover ${parseInt(siteData.imageCount) > 1 ? 'w-full h-40' : 'max-w-full max-h-64'}`} onError={(e) => {e.target.onerror = null; e.target.src = "https://placehold.co/150x150?text=Image+1"}} />{parseInt(siteData.imageCount) >= 2 && <img src={siteData.imageSrc2} className="rounded shadow-sm object-cover w-full h-40" onError={(e) => {e.target.onerror = null; e.target.src = "https://placehold.co/150x150?text=Image+2"}} />}{parseInt(siteData.imageCount) >= 3 && <img src={siteData.imageSrc3} className="rounded shadow-sm object-cover w-full h-40" onError={(e) => {e.target.onerror = null; e.target.src = "https://placehold.co/150x150?text=Image+3"}} />}</div>)}
                    </div>
                </div>
             </div>
          </div>
        </div>

        {showResetConfirm && (
            <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
                    <div className="flex items-center gap-3 text-red-400 mb-4"><AlertTriangle size={28} /><h2 className="text-xl font-bold text-white">Reset Code?</h2></div>
                    <p className="text-slate-300 mb-6">Are you sure you want to reset everything? <br/><span className="text-red-300 font-bold">This will delete all your changes.</span></p>
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-bold transition-colors flex items-center gap-2"><X size={18} /> Cancel</button>
                        <button onClick={confirmReset} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold transition-colors flex items-center gap-2"><Check size={18} /> Yes, Reset</button>
                    </div>
                </div>
            </div>
        )}

        {showRawCode && (
            <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col p-8 animate-in fade-in duration-200">
                <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <div><h2 className="text-2xl font-bold text-white">Generated Source Code</h2><p className="text-slate-400">This code includes all the features from your selected difficulty level.</p></div>
                        <button onClick={() => setShowRawCode(false)} className="text-white hover:text-blue-400 font-bold">Close X</button>
                    </div>
                    <textarea readOnly value={generateRawHTML()} className="flex-1 bg-black border border-slate-700 rounded-lg p-6 font-mono text-green-400 text-sm resize-none focus:outline-none shadow-2xl" />
                    <div className="mt-4 flex justify-end">
                        <button onClick={() => { navigator.clipboard.writeText(generateRawHTML()); alert("Copied!"); }} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md font-bold flex items-center gap-2"><Download size={20} /> Copy</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}