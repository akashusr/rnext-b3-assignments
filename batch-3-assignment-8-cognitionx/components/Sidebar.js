import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Edit,
  Trash2,
  User,
  LogOut,
  BarChart3,
  GitCompare,
  Code,
  Brain,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { ExportButton } from "./ExportButton";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

export function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const fetchConversations = () => {
    if (!user) {
      setConversations([]);
      return;
    }

    fetch("/api/conversation", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Ensure data is an array
        setConversations(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Failed to fetch conversations:", error);
        setConversations([]);
      });
  };

  useEffect(() => {
    if (user) {
      fetchConversations();

      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    } else {
      setConversations([]);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [pathname]);

  const handleEdit = (id, title) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleEditSave = async (id) => {
    await fetch(`/api/conversation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditingId(null);
    setEditTitle("");
    fetch("/api/conversation")
      .then((res) => res.json())
      .then(setConversations);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/conversation/${id}`, { method: "DELETE" });
    setConversations((prev) => prev.filter((c) => c._id !== id));
    if (pathname === `/conversation/${id}`) {
      router.push("/");
    }
  };

  return (
    <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white flex-col hidden md:flex">
      <div className="p-4 border-b border-gray-700 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="font-semibold text-sm">CognitionX</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Create Chat</span>
          </Link>
          <Link
            href="/rag"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors"
          >
            <Brain className="w-4 h-4" />
            <span className="text-sm">Knowledge Base</span>
          </Link>
          <Link
            href="/compare"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors"
          >
            <GitCompare className="w-4 h-4" />
            <span className="text-sm">Compare Models</span>
          </Link>
          <Link
            href="/playground"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors"
          >
            <Code className="w-4 h-4" />
            <span className="text-sm">API Playground</span>
          </Link>
          <Link
            href="/analytics"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Analytics</span>
          </Link>
        </div>
        <div className="pt-4">
          <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
            Conversations
          </span>
          <div className="space-y-1 mt-3">
            {conversations.map((convo) => (
              <div key={convo._id} className="flex items-center group">
                {editingId === convo._id ? (
                  <>
                    <input
                      className="bg-gray-800 dark:bg-gray-900 text-white rounded px-2 py-1 text-sm w-32"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleEditSave(convo._id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleEditSave(convo._id)
                      }
                      autoFocus
                    />
                  </>
                ) : (
                  <Link
                    href={`/conversation/${convo._id}`}
                    className="flex-1 flex items-center space-x-3 px-2 py-2 rounded-lg transition-colors text-sm hover:bg-gray-800 dark:hover:bg-gray-900"
                  >
                    <span className="text-zinc-300 dark:text-zinc-400 truncate max-w-[120px]">
                      {convo.title}
                    </span>
                  </Link>
                )}
                <button
                  className="ml-1 p-1 hover:bg-gray-700 dark:hover:bg-gray-800 rounded hidden group-hover:block"
                  onClick={() => handleEdit(convo._id, convo.title)}
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
                <div className="hidden group-hover:block">
                  <ExportButton conversationId={convo._id} />
                </div>
                <button
                  className="ml-1 p-1 hover:bg-gray-700 dark:hover:bg-gray-800 rounded hidden group-hover:block"
                  onClick={() => handleDelete(convo._id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-t border-gray-700 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1 hover:bg-gray-700 dark:hover:bg-gray-800 rounded transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-700 dark:border-gray-800 mt-auto">
        <div className="text-center space-y-2">
          <span className="text-xs text-gray-400">Powered by</span>
          <div className="flex items-center justify-center space-x-2">
            <img src="/assets/logo.svg" alt="Logo" className="h-10" />
          </div>
          <p className="text-xs text-gray-500">© 2025 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
}
