import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { FiUpload, FiSend, FiPlus } from "react-icons/fi";
import SideBar from "../components/SideBar";
import { toast } from "sonner";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  const token = localStorage.getItem("token");

  // Auto-scroll to bottom when new message or loading changes
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
          content: `✅ Resume uploaded successfully: **${selectedFile.name}**`,
        },
      ]);
      toast.success(`Uploaded: ${selectedFile.name}`);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload your resume first.");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt or question.");
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
        toast.success("AI response received!");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error getting AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />

      <main className="flex-1 pl-72 p-8 h-screen flex flex-col">
        <h1 className="text-2xl font-bold mb-2">AI Resume Assistant</h1>
        <p className="text-gray-500 mb-6">
          Chat with the AI to improve, format, or analyze your resume
        </p>

        {/* Chat Section */}
        <div className="flex flex-col flex-1 bg-white border border-black/10 rounded-md shadow-sm p-6">
          <div className="flex-1 mb-4 space-y-4 bg-gray-50 rounded-md p-4 border border-gray-100">
            {messages.length === 0 && !loading && (
              <p className="text-gray-400 text-center">
                👋 Start by uploading your resume or asking a question.
              </p>
            )}

            <div className="h-84 overflow-y-scroll flex flex-col gap-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : msg.role === "assistant"
                        ? "justify-start"
                        : "justify-center"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg text-sm md:text-base shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/50"
                        : msg.role === "assistant"
                          ? "bg-white border border-gray-300 text-gray-800"
                          : "bg-gray-100 text-gray-700 italic text-center"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-gray-500 italic flex items-center gap-2">
                  {/* <span>Generating Response</span> */}
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input + Actions */}
          <div className="flex items-center gap-2 relative">
            {/* "+" Button */}
            <div className="relative">
              <button
                onClick={() => setShowUploadMenu((prev) => !prev)}
                className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
              >
                <FiPlus className="text-gray-700" />
              </button>

              {showUploadMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-gray-200 shadow-md rounded-md p-2 w-48 z-10">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    <FiUpload /> Upload Resume
                  </button>
                  <button
                    onClick={() => {
                      setMessages([]);
                      setFile(null);
                      toast.info("Chat cleared");
                      setShowUploadMenu(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    🗑️ Clear Chat
                  </button>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Chat Input */}
            <input
              type="text"
              placeholder="Ask me anything about resume writing..."
              className="flex-1 border border-black/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="p-2 rounded-md shadow-xs bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              <FiSend />
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="px-3 py-1 text-sm border border-black/20 rounded-sm flex items-center gap-1 hover:bg-gray-100 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeAssistant;

const quickSuggestions: string[] = [
  "Suggestions to improve my resume for SDE role",
  "Format my resume for Data Analyst position",
  "Give me a summary of my strengths",
  "Highlight my technical projects",
  "How can I make my resume more ATS-friendly?",
  "Rewrite my professional summary for fresher SDE",
];
