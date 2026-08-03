import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Upload, FileText, X, Sparkles, Loader2, CheckCircle2, Type } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { uploadAndProcessFile, setViewMode } = useStudy();

  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [subject, setSubject] = useState('Artificial Intelligence');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'pptx' | 'txt'>('pdf');
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileObj(file);
      setFileName(file.name);
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'docx') setFileType('docx');
      else if (ext === 'pptx') setFileType('pptx');
      else if (ext === 'txt') setFileType('txt');
      else setFileType('pdf');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileObj(file);
      setFileName(file.name);
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'docx') setFileType('docx');
      else if (ext === 'pptx') setFileType('pptx');
      else if (ext === 'txt') setFileType('txt');
      else setFileType('pdf');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let contentToProcess = pastedText;

    if (activeTab === 'file' && selectedFileObj) {
      try {
        contentToProcess = await selectedFileObj.text();
      } catch (err) {
        contentToProcess = `Content extracted from ${fileName}. Contains core course concepts, definitions, and formulas.`;
      }
    }

    if (!fileName && activeTab === 'text') {
      setFileName('Custom Note.txt');
    }

    const finalTitle = fileName || 'Uploaded Study Note.pdf';

    setIsProcessing(true);
    const newMat = await uploadAndProcessFile(
      finalTitle,
      fileType,
      contentToProcess || `Study document content for ${finalTitle} under ${subject}.`,
      subject
    );
    setIsProcessing(false);

    if (newMat) {
      onClose();
      setViewMode('workspace');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Upload Study Material</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX, PPTX, or Notes</p>
            </div>
          </div>
          <button
            id="close-upload-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl text-xs font-semibold">
          <button
            id="upload-tab-file-btn"
            onClick={() => setActiveTab('file')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'file'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>File Upload</span>
          </button>
          <button
            id="upload-tab-text-btn"
            onClick={() => setActiveTab('text')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Paste Text / Notes</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Subject Field */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Subject / Course
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm font-medium focus:ring-2 focus:ring-purple-500/50 outline-none"
            >
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Biochemistry">Biochemistry</option>
              <option value="Physics">Physics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Psychology">Psychology</option>
              <option value="Economics">Economics</option>
            </select>
          </div>

          {activeTab === 'file' ? (
            /* File Drag & Drop */
            <div
              onDragOver={e => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                dragOver
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-purple-500/50 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                {selectedFileObj ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {selectedFileObj.name}
                    </p>
                    <p className="text-xs text-emerald-500 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready for AI Processing
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Drag & drop your file here, or <span className="text-purple-600 dark:text-purple-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-400">PDF, DOCX, PPTX, TXT up to 25MB</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Text Paste Mode */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 3 Notes - Organic Chemistry"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Pasted Notes Text
                </label>
                <textarea
                  rows={5}
                  placeholder="Paste lecture transcript, chapter notes, or article text here..."
                  value={pastedText}
                  onChange={e => setPastedText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Document with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Process with Gemini AI</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
