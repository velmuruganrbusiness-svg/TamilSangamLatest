
import React, { useState, useEffect, useRef } from 'react';
import type { ClassicalWork, ClassicalSection, ClassicalChapter } from '../types';
import { t, Language } from '../utils/translations';
import { SEO } from './SEO';
import { Icon } from './Icon';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

interface ClassicsViewProps {
  works: ClassicalWork[];
  language: Language;
  selectedWorkId: string | null;
}

const ReadingSettings: React.FC<{ 
    fontSize: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl'; 
    setFontSize: (size: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl') => void;
    language: Language;
}> = ({ fontSize, setFontSize, language }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full border transition-all ${isOpen ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white/80 text-[#8a7060] border-[#eaddcf] hover:text-[#3e2b22] dark:bg-[#1a1a1a] dark:border-neutral-700 dark:text-stone-400'}`}
                title={t('appearance', language)}
            >
                <Icon name="settings" />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#fdf8f1] dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-[#eaddcf] dark:border-neutral-800 p-4 z-50 animate-fade-in">
                    <div className="mb-4">
                        <label className="text-xs font-bold text-[#8a7060] uppercase tracking-wider block mb-2">{t('fontSize', language)}</label>
                        <div className="flex items-center justify-between bg-white/50 dark:bg-neutral-800 rounded-lg p-1 border border-[#eaddcf]/50">
                            {(['text-lg', 'text-xl', 'text-2xl', 'text-3xl'] as const).map(size => (
                                <button 
                                    key={size}
                                    onClick={() => setFontSize(size)}
                                    className={`flex-1 py-1 rounded-md text-sm font-bold transition-all ${fontSize === size ? 'bg-rose-500 shadow-sm text-white' : 'text-[#8a7060]'}`}
                                >
                                    A
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const VerseDisplay: React.FC<{ 
    chapter: ClassicalChapter, 
    workTitle: string, 
    language: Language,
    viewMode: 'scroll' | 'book',
    isSoundEnabled: boolean,
    fontSize: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl'
}> = ({ chapter, workTitle, language, viewMode, isSoundEnabled, fontSize }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);

    const totalPages = chapter.verses.length;

    useEffect(() => {
        setCurrentPage(0);
    }, [chapter]);

    const playPageTurnSound = () => {
        if (!isSoundEnabled) return;
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') ctx.resume();
            const bufferSize = ctx.sampleRate * 0.3;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800 + Math.random() * 200;
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);
            noise.start();
            noise.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    };

    return (
        <div className="animate-fade-in pb-20">
            <div className="max-w-4xl mx-auto px-1 min-h-[400px]">
                {viewMode === 'scroll' ? (
                    <div className="space-y-6">
                        {chapter.verses.map((verse, idx) => (
                            <div key={idx} className="bg-white/80 dark:bg-[#1a1a1a] p-6 md:p-8 rounded-[2rem] border border-[#eaddcf] dark:border-neutral-800 shadow-xl relative overflow-hidden group hover:border-rose-200 transition-all hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#eaddcf] dark:bg-neutral-800 group-hover:bg-rose-500 transition-colors duration-300"></div>
                                <span className="absolute -top-2 -right-2 text-6xl md:text-8xl font-black text-stone-50 dark:text-[#202020] select-none pointer-events-none opacity-50">{idx + 1}</span>
                                <p className={`font-tamil text-[#3e2b22] dark:text-stone-200 leading-loose relative z-10 font-medium text-center md:text-left ${fontSize}`}>{verse.text}</p>
                                {verse.explanation && (
                                    <div className="mt-6 pt-6 border-t border-[#eaddcf] dark:border-neutral-800 relative z-10">
                                        <h5 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2 font-sans">விளக்கம்</h5>
                                        <p className="font-tamil text-lg text-[#5c4235] dark:text-stone-400 leading-relaxed italic">{verse.explanation}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex-grow flex items-center justify-center min-h-[400px] mb-8">
                             <div key={currentPage} className="w-full bg-white/80 dark:bg-[#1a1a1a] p-8 md:p-14 rounded-[2rem] border border-[#eaddcf] dark:border-neutral-800 shadow-2xl relative overflow-hidden animate-fade-in flex flex-col justify-center">
                                <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                                <span className="absolute -top-4 -right-4 text-9xl font-black text-stone-50 dark:text-[#202020] select-none pointer-events-none opacity-50">{currentPage + 1}</span>
                                <div className="flex flex-col items-center justify-center text-center">
                                    <p className={`font-tamil text-[#3e2b22] dark:text-stone-100 leading-loose relative z-10 font-medium mb-8 ${fontSize === 'text-lg' ? 'text-2xl' : fontSize === 'text-xl' ? 'text-3xl' : fontSize === 'text-2xl' ? 'text-4xl' : 'text-5xl'}`}>{chapter.verses[currentPage].text}</p>
                                    {chapter.verses[currentPage].explanation && (
                                        <div className="w-full relative z-10 bg-[#fdf8f1]/50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-[#eaddcf]/50 dark:border-neutral-800">
                                             <h5 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2 font-sans">விளக்கம்</h5>
                                            <p className="font-tamil text-xl text-[#5c4235] dark:text-stone-400 leading-relaxed italic">{chapter.verses[currentPage].explanation}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between select-none bg-white/80 dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eaddcf] dark:border-neutral-800 shadow-lg">
                            <button onClick={() => { setCurrentPage(prev => Math.max(0, prev - 1)); playPageTurnSound(); }} disabled={currentPage === 0} className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${currentPage === 0 ? 'text-stone-300 cursor-not-allowed' : 'text-[#5c4235] hover:bg-[#fdf8f1] dark:text-stone-400 dark:hover:bg-neutral-800 hover:text-rose-600 font-bold'}`}><Icon name="chevron-left" /><span className="hidden sm:inline">{t('prevPage', language)}</span></button>
                            <span className="text-sm font-bold text-[#8a7060] uppercase tracking-widest bg-[#eaddcf]/30 dark:bg-neutral-800 px-4 py-2 rounded-lg">{t('pageOf', language).replace('{current}', (currentPage + 1).toString()).replace('{total}', totalPages.toString())}</span>
                            <button onClick={() => { setCurrentPage(prev => Math.min(totalPages - 1, prev + 1)); playPageTurnSound(); }} disabled={currentPage === totalPages - 1} className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${currentPage === totalPages - 1 ? 'text-stone-300 cursor-not-allowed' : 'text-[#5c4235] hover:bg-[#fdf8f1] dark:text-stone-400 dark:hover:bg-neutral-800 hover:text-rose-600 font-bold'}`}><span className="hidden sm:inline">{t('nextPage', language)}</span><Icon name="chevron-right" /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ChapterGrid: React.FC<{ 
    chapters: ClassicalChapter[], 
    sectionTitle?: string, 
    onSelectChapter: (chapter: ClassicalChapter) => void,
    language: Language 
}> = ({ chapters, sectionTitle, onSelectChapter, language }) => (
    <div className="animate-fade-in px-2 sm:px-4">
        {sectionTitle && (
            <h2 className="text-3xl font-black font-tamil text-[#3e2b22] dark:text-stone-100 mb-8 text-center">{sectionTitle}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-20">
            {chapters.map((chapter, index) => (
                <div key={index} onClick={() => onSelectChapter(chapter)} className="group bg-white/80 dark:bg-[#1a1a1a] rounded-3xl p-6 border border-[#eaddcf] dark:border-neutral-800 hover:border-rose-300 shadow-lg transition-all duration-500 hover:-translate-y-2 relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px]" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span className="text-5xl font-black text-[#3e2b22] dark:text-white font-sans">{(index + 1).toString().padStart(2, '0')}</span></div>
                    <div className="relative z-10 w-full flex flex-col items-center h-full justify-center">
                        <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3 mx-auto group-hover:scale-110 transition-transform duration-500"><Icon name="book" /></div>
                        <h4 className="text-lg font-bold font-tamil text-[#3e2b22] dark:text-stone-100 leading-snug group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors line-clamp-2">{chapter.chapter}</h4>
                         <div className="text-[#8a7060] text-[10px] font-bold mt-2 uppercase tracking-wider">{chapter.verses.length} {t('posts', language)}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SectionList: React.FC<{ sections: ClassicalSection[], onSelectSection: (section: ClassicalSection) => void }> = ({ sections, onSelectSection }) => {
    const getAccentColor = (id: string) => {
        if (id === 'aram') return 'from-[#fdf8f1] to-[#eaddcf] text-[#3e2b22] border-[#eaddcf]';
        if (id === 'porul') return 'from-amber-50 to-amber-100 text-amber-900 border-amber-200';
        if (id === 'inbam') return 'from-rose-50 to-rose-100 text-rose-900 border-rose-200';
        return 'from-white to-[#fdf8f1] text-[#3e2b22] border-[#eaddcf]';
    };

    return (
        <div className="animate-fade-in px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20 mt-4">
                {sections.map((section, idx) => (
                    <div key={section.id} onClick={() => onSelectSection(section)} className={`group relative rounded-[2.5rem] p-10 cursor-pointer overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br ${getAccentColor(section.id)} dark:bg-none dark:bg-[#1a1a1a] dark:border-neutral-800`}>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/40 dark:bg-white/5 pointer-events-none transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
                            <div>
                                <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                                     <h3 className="text-3xl md:text-4xl font-black font-tamil dark:text-stone-100">{section.title}</h3>
                                     <span className="px-3 py-1 rounded-lg bg-white/40 dark:bg-white/10 text-xs font-bold font-tamil backdrop-blur-md shadow-sm whitespace-nowrap border border-white/20">{section.chapters.length} அதிகாரங்கள்</span>
                                </div>
                                <p className="text-sm font-medium opacity-80 leading-relaxed dark:text-stone-400">{section.description}</p>
                            </div>
                            <div className="flex justify-between items-end mt-8">
                                <span className="text-4xl font-black opacity-10 dark:text-white">{(idx + 1).toString().padStart(2, '0')}</span>
                                <div className="w-12 h-12 rounded-full bg-white/60 dark:bg-neutral-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Icon name="chevron-right" /></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WorkIntro: React.FC<{ work: ClassicalWork, onStart: () => void, hasSections: boolean }> = ({ work, onStart, hasSections }) => (
    <div className="animate-fade-in text-center px-4 py-10 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="mb-6 inline-block p-3 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50"><Icon name="library" /></div>
        <h1 className="text-5xl md:text-7xl font-black font-tamil text-[#3e2b22] dark:text-stone-50 mb-6 tracking-tight leading-tight">{work.title}</h1>
        <div className="flex items-center justify-center space-x-3 text-stone-500 dark:text-stone-400 mb-10">
            <span className="h-px w-12 bg-[#eaddcf] dark:bg-stone-700"></span>
            <p className="text-2xl font-serif italic text-[#5c4235] dark:text-stone-300 font-medium">{work.author}</p>
            <span className="h-px w-12 bg-[#eaddcf] dark:bg-stone-700"></span>
        </div>
        <p className="text-lg md:text-2xl text-[#8a7060] dark:text-stone-400 max-w-3xl mx-auto leading-relaxed mb-12">{work.description}</p>
        <button onClick={onStart} className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-[#3e2b22] dark:bg-rose-600 rounded-full hover:bg-rose-600 dark:hover:bg-rose-700 hover:shadow-2xl hover:shadow-rose-600/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600"><span>வாசிக்கத் தொடங்க</span><span className="ml-3 group-hover:translate-x-1 transition-transform"><Icon name="chevron-right" /></span></button>
    </div>
);

export const ClassicsView: React.FC<ClassicsViewProps> = ({ works, language, selectedWorkId }) => {
  const [viewStage, setViewStage] = useState<'intro' | 'sections' | 'chapters' | 'verses'>('intro');
  const [selectedSection, setSelectedSection] = useState<ClassicalSection | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ClassicalChapter | null>(null);
  const [viewMode, setViewMode] = useState<'scroll' | 'book'>('scroll');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState<'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl'>('text-xl');

  const selectedWork = works.find(w => w.id === selectedWorkId);

  useEffect(() => {
      setViewStage('intro');
      setSelectedSection(null);
      setSelectedChapter(null);
  }, [selectedWorkId]);

  if (!selectedWorkId || !selectedWork) {
      return <div className="text-center py-20 font-tamil text-[#8a7060]">நூலைத் தேர்ந்தெடுக்கவும்</div>;
  }

  const hasSections = !!(selectedWork.sections && selectedWork.sections.length > 0);

  const getBreadcrumbs = () => {
      const items: BreadcrumbItem[] = [
          { label: t('home', language), onClick: () => window.location.reload(), icon: 'home' },
          { label: t('classics', language), icon: 'library' },
          { label: selectedWork.title, onClick: () => { setViewStage('intro'); setSelectedSection(null); setSelectedChapter(null); }, active: viewStage === 'intro' }
      ];
      if (viewStage !== 'intro') {
          if (hasSections) {
              items.push({ label: 'பகுப்புகள்', onClick: () => { setViewStage('sections'); setSelectedSection(null); setSelectedChapter(null); }, active: viewStage === 'sections' });
              if (selectedSection) items.push({ label: selectedSection.title, onClick: () => { setViewStage('chapters'); setSelectedChapter(null); }, active: viewStage === 'chapters' });
          } else {
              items.push({ label: 'அதிகாரங்கள்', onClick: () => { setViewStage('chapters'); setSelectedChapter(null); }, active: viewStage === 'chapters' });
          }
          if (selectedChapter && viewStage === 'verses') items.push({ label: selectedChapter.chapter, active: true });
      }
      return items;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <SEO title={`${selectedWork.title} | தமிழ்ச் சங்கம்`} description={selectedWork.description} />
      
      {viewStage !== 'intro' && (
        <div className="sticky top-20 z-10 bg-white/60 dark:bg-[#111111]/90 backdrop-blur-md -mx-4 px-4 py-3 mb-6 flex flex-wrap gap-4 justify-between items-center rounded-b-2xl shadow-sm border-b border-[#eaddcf]/50 dark:border-neutral-800">
             <Breadcrumbs items={getBreadcrumbs()} />
             {viewStage === 'verses' && (
                <div className="flex items-center gap-2 order-3 sm:order-2 ml-auto sm:ml-0">
                     <div className="flex items-center bg-[#eaddcf]/30 dark:bg-neutral-800 rounded-full p-1 border border-[#eaddcf]/50 dark:border-neutral-700">
                         <button onClick={() => setViewMode('scroll')} className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${viewMode === 'scroll' ? 'bg-white text-[#3e2b22] shadow-sm dark:bg-[#2b2b2b] dark:text-white' : 'text-[#8a7060] hover:text-[#3e2b22] dark:text-stone-400'}`} title={t('scrollMode', language)}><Icon name="scroll" /><span className="hidden sm:inline">{t('scrollMode', language)}</span></button>
                         <button onClick={() => setViewMode('book')} className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${viewMode === 'book' ? 'bg-white text-[#3e2b22] shadow-sm dark:bg-[#2b2b2b] dark:text-white' : 'text-[#8a7060] hover:text-[#3e2b22] dark:text-stone-400'}`} title={t('bookMode', language)}><Icon name="book-open" /><span className="hidden sm:inline">{t('bookMode', language)}</span></button>
                    </div>
                    {viewMode === 'book' && (
                         <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className={`p-2 rounded-full border transition-all ${isSoundEnabled ? 'bg-white text-rose-600 border-rose-200 shadow-sm dark:bg-[#2b2b2b] dark:text-rose-400 dark:border-neutral-700' : 'bg-[#eaddcf]/30 text-stone-400 border-[#eaddcf] dark:bg-[#1a1a1a] dark:text-stone-600 dark:border-neutral-800'}`} title={isSoundEnabled ? t('soundOn', language) : t('soundOff', language)}><Icon name={isSoundEnabled ? 'volume-up' : 'volume-off'} /></button>
                    )}
                    <ReadingSettings fontSize={fontSize} setFontSize={setFontSize} language={language} />
                </div>
             )}
        </div>
      )}

      {viewStage === 'verses' && selectedChapter ? (
          <VerseDisplay chapter={selectedChapter} workTitle={selectedWork.title} language={language} viewMode={viewMode} isSoundEnabled={isSoundEnabled} fontSize={fontSize} />
      ) : viewStage === 'chapters' ? (
          <ChapterGrid chapters={hasSections && selectedSection ? selectedSection.chapters : (selectedWork.content || [])} sectionTitle={selectedSection?.title} onSelectChapter={(c) => { setSelectedChapter(c); setViewStage('verses'); }} language={language} />
      ) : viewStage === 'sections' && selectedWork.sections ? (
          <SectionList sections={selectedWork.sections} onSelectSection={(s) => { setSelectedSection(s); setViewStage('chapters'); }} />
      ) : (
          <WorkIntro work={selectedWork} onStart={() => hasSections ? setViewStage('sections') : setViewStage('chapters')} hasSections={hasSections} />
      )}
    </div>
  );
};
