import {
  FiClock,
  FiLink,
  FiMail,
  FiSearch,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiTrash2,
  FiExternalLink,
} from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

type LinkedinPost = {
  id: string;
  postedPerson: string;
  description: string;
  batch: string;
  location: string;
  emailMentioned: string;
  phoneMentioned?: string;
  linkMentioned?: string;
  postedAt: string;
};

const LinkedinPosts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState<LinkedinPost[]>([]);
  const [initialPostData, setInitialPostData] = useState<LinkedinPost[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<LinkedinPost | null>(null);

  const { user } = useAuth();

  const fetchLinkedinPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_OTHERJOBS_API_URL}/jobs/linkedin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data.data)) {
        setInitialPostData(response.data.data);
        setPosts(response.data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      toast.error("Error fetching posts from our database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkedinPosts();
  }, []);

  const handleFilter = (input: string) => {
    if (input === "") {
      setPosts(initialPostData);
    } else {
      setPosts(
        initialPostData.filter(
          (post) =>
            post.postedPerson?.toLowerCase().includes(input.toLowerCase()) ||
            post.description?.toLowerCase().includes(input.toLowerCase()) ||
            post.location?.toLowerCase().includes(input.toLowerCase())
        )
      );
    }
  };

  const handleDeletePost = (post: LinkedinPost) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_OTHERJOBS_API_URL
        }/jobs/linkedin/${postToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Post removed successfully");
        fetchLinkedinPosts();
      }
    } catch (err) {
      toast.error("Error removing post");
    } finally {
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />
      
      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <FaLinkedin size={20} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight truncate">LinkedIn Outreach</h1>
            </div>
            <p className="text-sm md:text-base text-slate-500 font-medium">
              Curated opportunities and contacts from professional networks.
            </p>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 border border-slate-100 shadow-sm mb-10">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder="Search posts by recruiter name, role description, or location..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm text-slate-800"
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Posts List */}
        <div className="max-w-5xl mx-auto space-y-6">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning Professional Feed</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <FaLinkedin size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No Posts Found</h3>
              <p className="text-slate-500 font-medium max-w-sm">No curated LinkedIn opportunities are currently available matching your criteria.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="group bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 -mr-16 -mt-16 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all text-xl uppercase shadow-inner">
                        {post.postedPerson?.charAt(0) || <FiUser />}
                      </div>
                      <div>
                        <h2 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                          {post.postedPerson}
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                          <FiClock /> {new Date(post.postedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    
                    {user?.role === "COORDINATOR" && (
                      <button
                        onClick={() => handleDeletePost(post)}
                        className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer"
                        title="Delete Post"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>

                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50 italic">
                    "{post.description}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                        <FiCalendar />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Eligibility</p>
                        <p className="text-sm font-black text-slate-700 truncate">{post.batch}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <FiMapPin />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Location</p>
                        <p className="text-sm font-black text-slate-700 truncate">{post.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-100 gap-4">
                    <div className="flex gap-4 flex-wrap w-full sm:w-auto">
                      {post.phoneMentioned && (
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold hover:text-blue-600 transition-colors">
                          <FiPhone className="text-blue-400" /> {post.phoneMentioned}
                        </div>
                      )}
                      {post.linkMentioned && (
                        <a
                          href={post.linkMentioned}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-slate-500 text-xs font-bold hover:text-blue-600 transition-colors group/link"
                        >
                          <FiLink className="text-blue-400" /> 
                          <span>Original Post</span>
                          <FiExternalLink className="opacity-0 group-hover/link:opacity-100 transition-opacity" size={12} />
                        </a>
                      )}
                    </div>
                    
                    <a
                      href={`mailto:${post.emailMentioned}`}
                      className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FiMail /> Contact Recruiter
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={confirmDelete}
        postName={postToDelete?.postedPerson || ""}
      />
    </div>
  );
};

export default LinkedinPosts;
