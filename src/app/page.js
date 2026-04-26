"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Mic2,
  Headphones,
  Music2,
  Star,
  ArrowRight,
  User,
  Loader2,
} from "lucide-react";

// Daftar artis terkenal untuk rekomendasi
const POPULAR_ARTISTS = [
  {
    name: "The Weeknd",
    image:
      "/images/popular/theweeknd.png",
  },
  {
    name: "ZAYN",
    image:
      "/images/popular/zayn.png",
  },
  {
    name: "Ariana Grande",
    image:
      "/images/popular/arianagrande.png",
  },
  {
    name: "Bruno Mars",
    image:
      "/images/popular/brunomars.png",
  },
  {
    name: "Billie Eilish",
    image:
      "/images/popular/billieeilish.png",
  },
  {
    name: "Taylor Swift",
    image:
      "/images/popular/taylorswift.png",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const router = useRouter();

  // Fungsi untuk mencari artis (bisa dipanggil dari mana saja)
  const searchArtist = async (term) => {
    if (!term.trim()) {
      setArtists([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/itunes/search?term=${encodeURIComponent(term)}&entity=musicArtist&limit=10`,
      );
      const data = await res.json();
      setArtists(data.results || []);
    } catch (error) {
      console.error("Failed to search artist:", error);
      setArtists([]);
    }
    setLoading(false);
  };

  // Auto-search saat user mengetik (debounced)
  useEffect(() => {
    // Clear timeout sebelumnya
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set timeout baru untuk search setelah user berhenti mengetik 500ms
    const timeout = setTimeout(() => {
      if (searchTerm.trim()) {
        searchArtist(searchTerm);
      } else {
        setArtists([]);
      }
    }, 500);

    setDebounceTimeout(timeout);

    // Cleanup timeout saat komponen unmount atau searchTerm berubah
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm]);

  // Pilih artis dan mulai game
  const startGame = (artist) => {
    setSelectedArtist(artist);
    localStorage.setItem("selectedArtist", JSON.stringify(artist));
    router.push("/game");
  };

  // Handle search button click (manual search)
  const handleManualSearch = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    searchArtist(searchTerm);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      searchArtist(searchTerm);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        <div className="absolute top-[5%] left-[3%] animate-float-slow opacity-20">
          <Music2 className="w-10 h-10 text-white" />
        </div>
        <div className="absolute top-[15%] right-[8%] animate-float-fast opacity-15">
          <Headphones className="w-8 h-8 text-white" />
        </div>
        <div className="absolute top-[30%] left-[12%] animate-bounce-slow opacity-10">
          <Mic2 className="w-6 h-6 text-white" />
        </div>
        <div className="absolute top-[45%] right-[15%] animate-float-slow opacity-20">
          <Music2 className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-[60%] left-[8%] animate-float-fast opacity-15">
          <Headphones className="w-7 h-7 text-white" />
        </div>
        <div className="absolute top-[75%] right-[5%] animate-bounce-slow opacity-10">
          <Mic2 className="w-5 h-5 text-white" />
        </div>
        <div className="absolute top-[85%] left-[18%] animate-float-slow opacity-20">
          <Music2 className="w-9 h-9 text-white" />
        </div>
        <div className="absolute top-[10%] left-[25%] animate-float-fast opacity-5">
          <Music2 className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-[50%] left-[82%] animate-float-slow opacity-5">
          <Music2 className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-lg transform transition-all duration-500 hover:scale-[1.01]">
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden min-h-[800px]">
            {/* Header Section */}
            <div className="relative z-30 p-8 pb-0 text-center">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-slate-700 rounded-full p-4">
                    <Headphones className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-6xl font-bold mb-3 text-white tracking-tight">
                Guess the Song
              </h1>

              <p className="text-slate-300 text-base font-light">
                Challenge your music knowledge
              </p>

              <div className="flex justify-center gap-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 text-yellow-400/60 fill-current"
                  />
                ))}
              </div>
            </div>

            {/* Search Section */}
            <div className="relative z-30 p-8 pt-6">
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for an artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-20 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  onClick={handleManualSearch}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span className="text-sm font-medium">Search</span>
                    </>
                  )}
                </button>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="flex items-center justify-center gap-2 py-8">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  <p className="text-slate-400 text-sm">Searching artists...</p>
                </div>
              )}

              {/* Search Results */}
              {!loading && artists.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex items-center gap-2 mb-4">
                    <Mic2 className="w-4 h-4 text-blue-400" />
                    <p className="text-sm text-slate-300 font-medium">
                      Search Results for "{searchTerm}"
                    </p>
                  </div>

                  {artists.map((artist, index) => (
                    <button
                      key={artist.artistId}
                      onClick={() => startGame(artist)}
                      className="group relative w-full text-left p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 overflow-hidden"
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${index * 0.05}s backwards`,
                      }}
                    >
                      <div className="relative flex items-center gap-4">
                        {/* Artist Image */}
                        <div className="relative">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-600 group-hover:ring-blue-500 transition-all duration-300">
                            {artist.artworkUrl100 ? (
                              <img
                                src={artist.artworkUrl100}
                                alt={artist.artistName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                <User className="w-6 h-6 text-slate-500" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Artist Info */}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-base">
                            {artist.artistName}
                          </h3>
                          <p className="text-slate-400 text-xs">
                            Click to start
                          </p>
                        </div>

                        {/* Arrow Icon */}
                        <div className="transform transition-all duration-300 group-hover:translate-x-1">
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && searchTerm && artists.length === 0 && (
                <div className="text-center py-12 animate-fadeIn">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-4">
                    <Music2 className="w-10 h-10 text-slate-500" />
                  </div>
                  <p className="text-slate-300 text-lg mb-2">
                    No artists found
                  </p>
                  <p className="text-slate-400 text-sm">
                    Try a different search term or check the spelling
                  </p>
                </div>
              )}

              {/* Popular Artists Section - Only show when no search term */}
              {!searchTerm && !loading && artists.length === 0 && (
                <div className="text-center py-4 animate-fadeIn">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Mic2 className="w-4 h-4 text-blue-400" />
                    <p className="text-slate-300 text-sm font-medium">
                      Popular Artists
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {POPULAR_ARTISTS.map((artist, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          startGame({
                            artistName: artist.name,
                            artworkUrl100: artist.image,
                          })
                        }
                        className="group flex flex-col items-center gap-2 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl transition-all duration-300"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700 ring-2 ring-slate-600 group-hover:ring-blue-500 transition-all duration-300">
                          {artist.image ? (
                            <img
                              src={artist.image}
                              alt={artist.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-8 h-8 text-slate-500" />
                            </div>
                          )}
                        </div>
                        <span className="text-slate-300 text-xs font-medium group-hover:text-white transition-colors duration-300">
                          {artist.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-700/50 my-6"></div>
                  <p className="text-slate-400 text-sm">
                    Or search for your favorite artist above
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(15px) rotate(-10deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
