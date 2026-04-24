import React, { useState, useRef, useEffect } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { Download, Code2, Image as ImageIcon, LayoutTemplate, Smartphone, Monitor } from 'lucide-react';

const DEFAULT_HTML = `<div class="card">
  <h1>Hello World!</h1>
  <p>Edit this HTML code and CSS, then download as an image.</p>
  <button class="btn">Try it out</button>
</div>`;

const DEFAULT_CSS = `.card {
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  font-family: system-ui, sans-serif;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
h1 {
  margin: 0;
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -1px;
}
p {
  margin: 16px 0 0;
  font-size: 20px;
  opacity: 0.9;
}
.btn {
  margin-top: 32px;
  display: inline-block;
  background: white;
  color: #764ba2;
  padding: 12px 24px;
  border-radius: 99px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
  border: none;
  cursor: pointer;
  outline: none;
}`;

export default function App() {
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [isExporting, setIsExporting] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState<'auto' | 'mobile' | 'desktop'>('auto');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!previewRef.current) return;
    try {
      setIsExporting(true);
      
      // Target the exact user content wrapper
      const element = previewRef.current;
      
      const options = {
        quality: 0.95,
        backgroundColor: '#ffffff', // default background
        style: {
          margin: '0', 
        }
      };

      const dataUrl = await (format === 'png' 
        ? toPng(element, options) 
        : toJpeg(element, options));
        
      const link = document.createElement('a');
      link.download = `code-to-image-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to generate image. Ensure your HTML does not contain broken external image links.');
    } finally {
      setIsExporting(false);
    }
  };

  const getPreviewContainerStyle = () => {
    switch (deviceWidth) {
      case 'mobile': return { width: '375px', margin: '0 auto' };
      case 'desktop': return { width: '800px', margin: '0 auto' };
      default: return { width: '100%' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="h-16 px-6 lg:px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ImageIcon size={20} className="text-white" />
          </div>
          <div className="flex items-center">
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">HTML to Image</h1>
            <span className="text-indigo-600 font-medium text-xs sm:text-sm border border-indigo-100 px-2 py-0.5 rounded-full ml-3 hidden sm:inline-block">Renderer</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownload('jpeg')}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            <Download size={16} />
            <span className="hidden sm:inline">JPG</span>
          </button>
          <button
            onClick={() => handleDownload('png')}
            disabled={isExporting}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
          >
            {isExporting ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> : <Download size={16} />}
            <span className="hidden sm:inline">Download PNG</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 lg:p-6 gap-4 lg:gap-6">
        
        {/* Left Column: Editor */}
        <section className="w-full lg:w-1/2 flex flex-col bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="h-12 bg-slate-800/50 px-4 flex items-center justify-between border-b border-slate-700 shrink-0">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-slate-400 text-xs font-mono hidden sm:inline">index.html</span>
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveTab('html')}
                className={`text-xs font-mono px-3 py-1.5 rounded cursor-pointer transition-colors ${activeTab === 'html' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}
              >
                HTML
              </button>
              <button 
                onClick={() => setActiveTab('css')}
                className={`text-xs font-mono px-3 py-1.5 rounded cursor-pointer transition-colors ${activeTab === 'css' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}
              >
                CSS
              </button>
            </div>
          </div>
          {activeTab === 'html' ? (
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="flex-1 w-full p-6 font-mono text-sm bg-transparent text-slate-300 focus:outline-none resize-none leading-relaxed"
              placeholder="Paste your HTML here..."
              spellCheck="false"
            />
          ) : (
            <textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              className="flex-1 w-full p-6 font-mono text-sm bg-transparent text-slate-300 focus:outline-none resize-none leading-relaxed"
              placeholder="Write your CSS here..."
              spellCheck="false"
            />
          )}
        </section>

        {/* Right Column: Preview */}
        <section className="w-full lg:w-1/2 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</span>
            </div>
            
            <div className="flex items-center bg-slate-200/50 p-1 rounded-lg">
               <button 
                  onClick={() => setDeviceWidth('auto')}
                  className={`p-1.5 rounded-md transition-colors ${deviceWidth === 'auto' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Responsive Width"
                >
                 <LayoutTemplate size={14} />
               </button>
               <button 
                  onClick={() => setDeviceWidth('mobile')}
                  className={`p-1.5 rounded-md transition-colors ${deviceWidth === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Mobile Width (375px)"
                >
                 <Smartphone size={14} />
               </button>
               <button 
                  onClick={() => setDeviceWidth('desktop')}
                  className={`p-1.5 rounded-md transition-colors ${deviceWidth === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Desktop Width (800px)"
                >
                 <Monitor size={14} />
               </button>
            </div>
          </div>
          
          {/* Scrollable preview area */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center bg-slate-50 relative">
            <div className="absolute inset-0 pattern-grid-lg opacity-5 pointer-events-none"></div>
            {/* The actual element to be captured */}
            <div 
              style={getPreviewContainerStyle()}
              className="bg-white shadow-xl shadow-slate-200/50 border border-transparent hover:border-indigo-200 transition-colors z-10 rounded-sm"
            >
              <div 
                ref={previewRef}
                className="w-full h-full min-h-[100px] overflow-hidden relative" 
                id="capture-area"
              >
                <style>{cssCode}</style>
                <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
              </div>
            </div>
          </div>
        </section>
        
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Renderer: Active
          </span>
          <span>DOM Engine: idle</span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
          Powered by html-to-image • Made by Shakti Rao Mani
        </div>
      </footer>
    </div>
  );
}
