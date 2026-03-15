import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { 
  FiUpload, 
  FiSend, 
  FiPlus, 
  FiTrash2, 
  FiCheckCircle, 
  FiCpu, 
  FiFileText, 
  FiUser,
  FiZap
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { toast } from "sonner";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ResumeAssistant: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant" | "system"; content: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const token = localStorage.getItem("token");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowUploadMenu(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `✅ Resume analyzed: **${selectedFile.name}**`,
        },
      ]);
      toast.success(`Loaded: ${selectedFile.name}`);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload your resume first.");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    const userMessage = { role: "user" as const, content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("userPromptText", userMessage.content);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/resume-review`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const reply =
          typeof res.data.data === "string"
            ? res.data.data
            : JSON.stringify(res.data.data, null, 2);

        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } else {
        toast.error(res.data.message || "Failed to process resume");
      }
    } catch (err) {
      console.error(err);
      toast.error("AI service error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 flex flex-col h-screen overflow-hidden transition-all duration-300">
        {/* Sticky Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <FiCpu className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">AI Resume Assistant</h1>
              {/* <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">GPT-4 Turbo Powered</p>
              </div> */}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {file && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold">
                <FiFileText /> {file.name}
              </div>
            )}
          </div>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar bg-gray-50/30">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-top-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-slate-200">
                  <FiCpu className="text-4xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">How can I help with your career?</h2>
                <p className="text-slate-400 font-medium max-w-sm">Upload your resume and ask for improvements, ATS optimization, or career-specific formatting.</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] p-5 rounded-3xl text-sm md:text-base transition-all
                    ${msg.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-200"
                      : msg.role === "assistant"
                        ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm"
                        : "bg-blue-50 text-blue-700 border border-blue-100 italic text-center mx-auto text-xs font-bold px-6 py-2"
                    }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-slate max-w-none prose-sm md:prose-base leading-relaxed
                      prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-blue-600 prose-code:bg-slate-50 prose-code:p-1 prose-code:rounded">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="font-medium leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white border border-slate-100 rounded-3xl rounded-tl-none p-5 text-blue-600 shadow-sm flex items-center gap-3">
                  <FiCpu className="animate-spin text-xl" />
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} className="h-4" />
          </div>
        </div>

        {/* Input area Container */}
        <div className="bg-white border-t border-slate-100 p-4 md:p-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Quick Suggestions - Horizontal scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="px-4 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 hover:border-blue-100 rounded-xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 group"
                >
                  <FiZap className="text-amber-500 group-hover:scale-110 transition-transform" /> {suggestion}
                </button>
              ))}
            </div>

            {/* Main Input Bar */}
            <div className="bg-slate-50 rounded-[2rem] p-2 flex items-center gap-2 border border-slate-100 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <div className="relative">
                <button
                  onClick={() => setShowUploadMenu((prev) => !prev)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer
                    ${file ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}
                >
                  {file ? <FiCheckCircle className="text-xl" /> : <FiPlus className="text-xl" />}
                </button>

                {showUploadMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowUploadMenu(false)}></div>
                    <div className="absolute bottom-full left-0 mb-4 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 w-56 z-30 animate-in slide-in-from-bottom-2 duration-200">
                      <button
                        onClick={() => { fileInputRef.current?.click(); setShowUploadMenu(false); }}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><FiUpload /></div>
                        Upload Resume
                      </button>
                      <button
                        onClick={() => {
                          setMessages([]);
                          setFile(null);
                          toast.info("Session reset");
                          setShowUploadMenu(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><FiTrash2 /></div>
                        Reset Assistant
                      </button>
                    </div>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <input
                type="text"
                placeholder={file ? "Ask about your resume..." : "Upload resume to begin analysis..."}
                className="flex-1 bg-transparent border-none px-4 py-3 text-sm font-medium outline-none text-slate-800 placeholder:text-slate-400"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !file || !prompt.trim()}
                className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 disabled:opacity-30 disabled:bg-slate-200 transition-all shadow-lg hover:shadow-blue-100 cursor-pointer shrink-0"
              >
                <FiSend className="text-lg" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">Powered by PlaceNest Career AI Engine</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeAssistant;

const quickSuggestions: string[] = [
  "Improve for SDE role",
  "ATS Check",
  "Summarize strengths",
  "Technical projects feedback",
  "Role-specific formatting",
  "Rewrite summary",
];
