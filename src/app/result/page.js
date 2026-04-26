"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Headphones,
  Home,
  RotateCcw,
  User,
  Star,
  Clock,
  Trophy,
  Music2,
  Sparkles,
} from "lucide-react";

export default function ResultPage() {
  const [artist, setArtist] = useState(null);
  const [gameStats, setGameStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedArtist = localStorage.getItem("selectedArtist");
    const savedStats = localStorage.getItem("gameStats");

    if (!savedArtist || !savedStats) {
      router.push("/");
      return;
    }

    setArtist(JSON.parse(savedArtist));
    setGameStats(JSON.parse(savedStats));
  }, [router]);

  const getResultMessage = () => {
    if (!gameStats) return {};

    const percentage = (gameStats.score / gameStats.totalRounds) * 100;
    const timeInMinutes = Math.floor(gameStats.timeSpent / 60000);
    const timeInSeconds = Math.floor((gameStats.timeSpent % 60000) / 1000);

    if (percentage >= 70) {
      return {
        title: "True Fan!",
        emoji: <Trophy className="w-8 h-8" />,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10 border-yellow-500/30",
        gradient: "from-yellow-400 to-orange-500",
        message: `Amazing! You got ${gameStats.score}/${gameStats.totalRounds} correct in ${timeInMinutes}m ${timeInSeconds}s. You're a true ${artist?.artistName} fan!`,
      };
    } else if (percentage >= 50) {
      return {
        title: "Good Job!",
        emoji: <Star className="w-8 h-8" />,
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/30",
        gradient: "from-green-400 to-emerald-500",
        message: `Not bad! You scored ${gameStats.score}/${gameStats.totalRounds} in ${timeInMinutes}m ${timeInSeconds}s. You know your ${artist?.artistName} songs pretty well!`,
      };
    } else {
      return {
        title: "Keep Learning!",
        emoji: <Music2 className="w-8 h-8" />,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/30",
        gradient: "from-blue-400 to-cyan-500",
        message: `You got ${gameStats.score}/${gameStats.totalRounds} correct in ${timeInMinutes}m ${timeInSeconds}s. Time to listen to more ${artist?.artistName} songs!`,
      };
    }
  };

  const result = getResultMessage();

  const playAgain = () => {
    localStorage.removeItem("finalScore");
    router.push("/game");
  };

  const chooseNewArtist = () => {
    localStorage.removeItem("selectedArtist");
    localStorage.removeItem("finalScore");
    router.push("/");
  };

  if (!artist) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400 text-xl font-semibold">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Floating Music Icons */}
        <div className="absolute top-[5%] left-[3%] animate-float-slow opacity-20">
          <Music2 className="w-10 h-10 text-white" />
        </div>
        <div className="absolute top-[15%] right-[8%] animate-float-fast opacity-15">
          <Headphones className="w-8 h-8 text-white" />
        </div>
        <div className="absolute top-[30%] left-[12%] animate-bounce-slow opacity-10">
          <Music2 className="w-6 h-6 text-white" />
        </div>
        <div className="absolute top-[45%] right-[15%] animate-float-slow opacity-20">
          <Music2 className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-[60%] left-[8%] animate-float-fast opacity-15">
          <Headphones className="w-7 h-7 text-white" />
        </div>
        <div className="absolute top-[75%] right-[5%] animate-bounce-slow opacity-10">
          <Music2 className="w-5 h-5 text-white" />
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
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative z-30 p-6 pb-4 text-center">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-70 animate-pulse"></div>
                  <div className="relative bg-slate-800 rounded-full p-4">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                Game Complete!
              </h1>
              <p className="text-slate-400 text-sm">Here's how you did</p>
            </div>

            {/* Artist Info */}
            <div className="relative z-30 px-6 pb-4 text-center">
              <div className="inline-block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-50"></div>
                  {artist.artworkUrl100 ? (
                    <img
                      src={artist.artworkUrl100}
                      alt={artist.artistName}
                      className="relative w-20 h-20 rounded-full mx-auto ring-4 ring-blue-500/50 object-cover"
                    />
                  ) : (
                    <div className="relative w-20 h-20 rounded-full mx-auto bg-slate-700 flex items-center justify-center ring-4 ring-blue-500/50">
                      <User className="w-10 h-10 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>
              <h2 className="text-white text-xl font-bold mt-3">
                {artist.artistName}
              </h2>
            </div>

            {/* Result Card */}
            <div className={`relative z-30 px-6 pb-4`}>
              <div
                className={`p-6 rounded-2xl border ${result.bgColor} bg-gradient-to-br from-transparent to-${result.color.split(" ")[0].replace("text-", "")}/5`}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className={result.color}>{result.emoji}</div>
                  <h3 className={`text-2xl font-bold ${result.color}`}>
                    {result.title}
                  </h3>
                </div>
                <p className="text-slate-300 text-center mb-6">
                  {result.message}
                </p>

                {/* Score Display */}
                <div className="text-center mb-4">
                  <div
                    className={`text-6xl font-bold bg-gradient-to-r ${result.gradient} bg-clip-text text-transparent mb-2`}
                  >
                    {gameStats?.score}/{gameStats?.totalRounds}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-slate-300">
                      {gameStats
                        ? Math.round(
                            (gameStats.score / gameStats.totalRounds) * 100,
                          )
                        : 0}
                      % Accuracy
                    </span>
                  </div>
                </div>

                {/* Time Display */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-white/10">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">
                    Completed in{" "}
                    {gameStats
                      ? `${Math.floor(gameStats.timeSpent / 60000)}m ${Math.floor((gameStats.timeSpent % 60000) / 1000)}s`
                      : "0s"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-30 p-6 pt-2 space-y-3">
              {gameStats && gameStats.score >= 7 ? (
                <button
                  onClick={chooseNewArtist}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Try Another Artist
                </button>
              ) : (
                <>
                  <button
                    onClick={playAgain}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Play Again with {artist.artistName}
                  </button>
                  <button
                    onClick={chooseNewArtist}
                    className="w-full py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Music2 className="w-4 h-4" />
                    Choose Different Artist
                  </button>
                </>
              )}

              <button
                onClick={() => router.push("/")}
                className="w-full py-3 text-slate-400 hover:text-white transition-colors duration-300 text-sm flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
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

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
