import { 
  FiBriefcase, 
  FiMapPin, 
  FiDollarSign, 
  FiCalendar, 
  FiAward,
  FiCheckCircle,
  FiPlus,
  FiUser,
  FiFileText
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useState } from "react";
import type { Job, Branch } from "../types/job.types";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const jobTypes = [
  { label: "Full Time", value: "FullTime" },
  { label: "Part Time", value: "PartTime" },
  { label: "Internship", value: "Internship" },
  { label: "Contract", value: "Contract" },
] as const;

const branches: { label: string; value: Branch }[] = [
  { label: "Computer Science", value: "CSE" },
  { label: "Chemical", value: "CY" },
  { label: "Information Tech", value: "IT" },
  { label: "Mechanical", value: "ME" },
  { label: "Electronics & Comm", value: "ECE" },
  { label: "Electronics & Instrumentation", value: "EIC" },
  { label: "Electrical", value: "EE" },
  { label: "Civil", value: "CE" },
];

export default function PostJob() {
  const [formData, setFormData] = useState<Job>({
    type: "FullTime",
    title: "",
    description: "",
    location: "",
    position: "",
    salary: 0,
    cgpaCutOff: 0,
    deadline: "",
    status: "ACTIVE",
    branchCutOff: [],
    yearCutOff: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => String(currentYear + i)); 

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleBranchToggle = (branch: Branch) => {
    setFormData((prev) => {
      const isSelected = prev.branchCutOff.includes(branch);
      const updatedBranches = isSelected
        ? prev.branchCutOff.filter((b) => b !== branch)
        : [...prev.branchCutOff, branch];

      return { ...prev, branchCutOff: updatedBranches };
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.location || !formData.position || !formData.deadline) {
      return toast.error("Please fill in all required fields");
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/job`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Job posting published successfully!");
        navigate("/company/manage-jobs");
      }
    } catch (err) {
      toast.error("Error creating job posting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="max-w-full overflow-hidden">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Create Job Posting</h1>
              <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Design a detailed job profile to attract the best campus talent.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Basic Info Card */}
              <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                    <FiBriefcase />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Role Details</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Core Information</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Job Title *</label>
                    <input
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer - Cloud Native"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Location *</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                          <FiMapPin />
                        </div>
                        <input
                          name="location"
                          type="text"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Bangalore or Remote"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Hiring Category *</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-sm text-slate-600 cursor-pointer appearance-none shadow-inner"
                      >
                        {jobTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Target Position *</label>
                      <input
                        name="position"
                        type="text"
                        value={formData.position}
                        onChange={handleChange}
                        placeholder="Lead Architect, SDE-1..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Salary Package (LPA)</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500">
                          <FiDollarSign />
                        </div>
                        <input
                          name="salary"
                          type="number"
                          value={formData.salary}
                          onChange={handleChange}
                          placeholder="e.g. 12"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Description Card */}
              <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                    <FiFileText />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Job Description</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scope & Requirements</p>
                  </div>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-800 resize-none leading-relaxed"
                  placeholder="Tell students about the role, tech stack, and what makes your company unique..."
                />
              </section>
            </div>

            {/* Right Column: Criteria & Action */}
            <div className="space-y-8">
              {/* Eligibility Card */}
              <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                    <FiAward />
                  </div>
                  <h3 className="text-lg font-bold">Eligibility</h3>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Allowed Branches *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {branches.map((branch) => (
                        <button
                          key={branch.value}
                          type="button"
                          onClick={() => handleBranchToggle(branch.value)}
                          className={`flex items-center justify-center p-3 rounded-xl border text-[10px] font-black transition-all cursor-pointer
                            ${formData.branchCutOff.includes(branch.value) 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                              : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                        >
                          {branch.value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Target Batches *</label>
                    <div className="flex flex-wrap gap-2">
                      {availableYears.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => {
                            const isSelected = formData.yearCutOff?.includes(year);
                            setFormData(prev => ({
                              ...prev,
                              yearCutOff: isSelected 
                                ? prev.yearCutOff?.filter(y => y !== year) 
                                : [...(prev.yearCutOff || []), year]
                            }));
                          }}
                          className={`px-4 py-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer
                            ${formData.yearCutOff?.includes(year)
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                              : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">CGPA Cutoff</label>
                    <div className="relative">
                       <input
                        name="cgpaCutOff"
                        type="number"
                        step="0.1"
                        value={formData.cgpaCutOff}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Application Deadline *</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-500">
                        <FiCalendar />
                      </div>
                      <input
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Action Section */}
              <div className="p-8 text-white relative overflow-hidden">
                
                <div className="space-y-4 relative z-10">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : <><FiPlus className="text-lg" /> Publish Posting</>}
                  </button>
                  <button 
                    onClick={() => navigate('/company/manage-jobs')}
                    className="w-full py-4 bg-gray-50 border border-black/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
