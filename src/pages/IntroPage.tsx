import {
  FaUserGraduate,
  FaBuilding,
  FaRobot,
  FaChartLine,
  FaCheckCircle,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaBell,
  FaUniversity,
  FaBullhorn,
} from "react-icons/fa";
import { FiMessageSquare, FiArrowRight, FiTarget, FiZap, FiCalendar, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    icon: <FaUserGraduate className="text-4xl text-blue-600 mb-4" />,
    heading: "For Students",
    description:
      "Find campus opportunities, apply with ease, and boost your profile with AI-powered resume assistance.",
    buttonText: "Join as Student",
    color: "blue",
    features: ["AI Resume Builder", "Placement Notifications", "Application Tracking"],
  },
  {
    icon: <FaBuilding className="text-4xl text-indigo-600 mb-4" />,
    heading: "For Recruiters",
    description:
      "Post job openings, discover top-tier campus talent, and manage your entire recruitment workflow.",
    buttonText: "Join as Recruiter",
    color: "indigo",
    features: ["Talent Sourcing", "Interview Scheduling", "Student Profiles"],
  },
  {
    icon: <FiMessageSquare className="text-4xl text-emerald-600 mb-4" />,
    heading: "For TPO Office",
    description:
      "Training & Placement Office (TPO) tools to manage verifications, oversee statistics, and drive campus success.",
    buttonText: "TPO Access",
    color: "emerald",
    features: ["Student Verification", "Placement Analytics", "Company Coordination"],
  },
];

const stats = [
  { label: "Students Placed", value: "1,200+", icon: <FaUserGraduate /> },
  { label: "Partner Companies", value: "85+", icon: <FaBuilding /> },
  { label: "Ongoing Drives", value: "12", icon: <FiZap /> },
  { label: "Average Package", value: "₹8.5 LPA", icon: <FaCheckCircle /> },
];

const announcements = [
  { title: "Google Cloud Drive 2026", date: "Coming Soon", type: "Drive" },
  { title: "Resume Workshop with AI Tools", date: "March 20, 2:00 PM", type: "Workshop" },
  { title: "Mock Interview Round 3", date: "Ongoing", type: "Training" },
];

const recruiters = [
  "Google", "Amazon", "Microsoft", "TCS", "Infosys", "Wipro", "Accenture", "Deloitte"
];

export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-none">
                  Place<span className="text-blue-600">Nest</span>
                </h1>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">College Placement Portal</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#announcements" className="text-gray-600 hover:text-blue-600 transition-colors">Notices</a>
              <a href="#roles" className="text-gray-600 hover:text-blue-600 transition-colors">Portals</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">AI Features</a>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 transition-all cursor-pointer"
              >
                Portal Registration
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-wide uppercase mb-6 border border-blue-100">
            <FaUniversity className="mr-2" /> Official Placement Cell Platform
          </div>
          <h2 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Empowering Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Campus Career Journey
            </span>
          </h2>
          <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The intelligent hub for all your training and placement activities. 
            Bridging the gap between our talented students and global recruiters.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center"
            >
              Get Started <FiArrowRight className="ml-2" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center">
              <FiCalendar className="mr-2" /> View Drive Schedule
            </button>
          </div>
        </div>
      </section>

      {/* Recruiter Showcase */}
      <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by Top Recruiters</p>
           <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
              {recruiters.map(name => (
                <span key={name} className="text-xl lg:text-2xl font-black text-gray-400">{name}</span>
              ))}
           </div>
        </div>
      </section>

      {/* Quick Dashboard Info & Announcements */}
      <section id="announcements" className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Announcements/Notices */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-8">
              <FaBullhorn className="text-blue-600 text-xl" />
              <h3 className="text-2xl font-bold">Campus Notices</h3>
            </div>
            <div className="space-y-4">
              {announcements.map((ann, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-md">
                   <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wide">{ann.type}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">{ann.date}</span>
                   </div>
                   <h4 className="font-bold text-gray-800">{ann.title}</h4>
                </div>
              ))}
              <button className="w-full py-3 text-blue-600 text-sm font-bold hover:bg-blue-50 rounded-xl transition-all">View All Notices</button>
            </div>
          </div>

          {/* Placement Statistics */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-8">
              <FaChartLine className="text-blue-600 text-xl" />
              <h3 className="text-2xl font-bold">Placement Snapshot</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all border-b-4 border-b-blue-500">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="roles" className="py-24 lg:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">University Placement Ecosystem</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Access the specific portal tailored for your role within the campus recruitment process.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div 
              key={role.heading}
              className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-${role.color}-50 text-${role.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                {role.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{role.heading}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-sm">{role.description}</p>
              
              <ul className="space-y-3 mb-10">
                {role.features.map((feat) => (
                  <li key={feat} className="flex items-center text-xs text-gray-500 font-semibold">
                    <FaCheckCircle className={`text-${role.color}-500 mr-2 shrink-0`} /> {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => navigate('/register')}
                className={`w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer border
                  ${role.color === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent shadow-lg shadow-blue-100' : ''}
                  ${role.color === 'indigo' ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent shadow-lg shadow-indigo-100' : ''}
                  ${role.color === 'emerald' ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent shadow-lg shadow-emerald-100' : ''}
                `}
              >
                {role.buttonText} <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* AI Features Highlight */}
      <section id="features" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/10 skew-x-12 translate-x-1/2 -z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wide uppercase mb-6 border border-blue-500/20">
                <FaRobot className="mr-2" /> Modern AI Edge
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
                Smart Tools for the <br /><span className="text-blue-400">Next-Gen Placement</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4 group">
                  <div className="shrink-0 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FaRobot className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">AI Resume Optimizer</h4>
                    <p className="text-gray-400 leading-relaxed text-sm">Industry-standard resume analysis that suggests improvements based on successful placement data.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="shrink-0 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <FiTarget className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Targeted Opportunity Matching</h4>
                    <p className="text-gray-400 leading-relaxed text-sm">Automatically matches student skillsets with recruiter requirements for better conversion rates.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="shrink-0 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <FaChartLine className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">TPO Analytics Dashboard</h4>
                    <p className="text-gray-400 leading-relaxed text-sm">Deep insights for the college placement office to track performance and identify training needs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-2xl overflow-hidden group p-1 border-8 border-white/5">
                <div className="bg-slate-900/50 absolute inset-0 group-hover:bg-slate-900/0 transition-all"></div>
                <div className="flex flex-col items-center justify-center h-full p-8 text-center relative z-10">
                   <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <FaRobot className="text-4xl text-blue-400" />
                   </div>
                   <h3 className="text-2xl font-bold mb-4">Official College AI Portal</h3>
                   <p className="text-blue-100 text-sm">Empowering students with GPT-4 powered resume assistance and automated profile verification workflows.</p>
                   <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[10px] uppercase font-bold tracking-wider">Verification: Auto</div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-[10px] uppercase font-bold tracking-wider">Matching: AI-Driven</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute top-0 left-0 w-full h-full -z-0">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">Ready to Launch Your Career?</h2>
              <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-12">
                Join our college's official placement platform and get exclusive access to campus drives and AI career tools.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-extrabold text-xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-700/20 cursor-pointer flex items-center justify-center"
                >
                  Join the Portal <FiArrowRight className="ml-2" />
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-10 py-5 bg-blue-700 text-white rounded-2xl font-extrabold text-xl hover:bg-blue-800 transition-all border border-blue-500 cursor-pointer"
                >
                  Student Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                <h1 className="text-xl font-bold text-gray-900">PlaceNest</h1>
              </div>
              <p className="text-gray-500 leading-relaxed mb-6 text-sm font-medium">
                The official training and placement platform for our college. Powered by PlaceNest AI.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all"><FaLinkedin /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all"><FaTwitter /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all"><FaGithub /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Resources</h4>
              <ul className="space-y-4 text-gray-500 font-semibold text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Notice Board</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Placement Calendar</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Interview Prep</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">AI Resume Guide</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Office</h4>
              <ul className="space-y-4 text-gray-500 font-semibold text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About TPO</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Office</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Verification FAQs</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Campus Guidelines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Help & Support</h4>
              <ul className="space-y-4 text-gray-500 font-semibold text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Student Support</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Recruiter Help</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Report Issue</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <p>© {new Date().getFullYear()} College Placement Cell. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
