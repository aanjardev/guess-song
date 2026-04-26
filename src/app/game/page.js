"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Headphones,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  ArrowRight,
  Home,
  Music2,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function GamePage() {
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(10);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameEndTime, setGameEndTime] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const router = useRouter();

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Update audio progress
  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 30;
        setCurrentTime(current);
        setAudioProgress((current / dur) * 100);

        // Stop at 7 seconds
        if (current >= 7) {
          audioRef.current.pause();
          setIsPlaying(false);
          setAudioProgress(0);
          setCurrentTime(0);
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }
      }
    }, 100);
  };

  // Ambil data artis dari localStorage
  useEffect(() => {
    const savedArtist = localStorage.getItem("selectedArtist");
    if (!savedArtist) {
      router.push("/");
      return;
    }
    setArtist(JSON.parse(savedArtist));
    setGameStartTime(Date.now());
  }, [router]);

  // Ambil daftar lagu dari artis
  useEffect(() => {
    if (!artist) return;

    const fetchSongs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/itunes/search?term=${encodeURIComponent(artist.artistName)}&entity=song&limit=50`,
        );
        const data = await res.json();
        const songsWithPreview = (data.results || []).filter(
          (song) => song.previewUrl,
        );
        setSongs(songsWithPreview);
        loadNewQuestion(songsWithPreview);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
      setLoading(false);
    };

    fetchSongs();
  }, [artist]);

  // Muat pertanyaan baru
  const loadNewQuestion = (songList = songs) => {
    if (!songList.length) return;

    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setAudioProgress(0);
    setCurrentTime(0);

    const randomIndex = Math.floor(Math.random() * songList.length);
    const correctSong = songList[randomIndex];

    const otherSongs = songList.filter(
      (s) => s.trackId !== correctSong.trackId,
    );
    const shuffledOthers = [...otherSongs].sort(() => 0.5 - Math.random());
    const wrongChoices = shuffledOthers.slice(0, 2).map((s) => s.trackName);

    const allChoices = [correctSong.trackName, ...wrongChoices];
    allChoices.sort(() => 0.5 - Math.random());

    setCurrentSong(correctSong);
    setChoices(allChoices);
    setFeedback(null);
    setSelectedChoice(null);
  };

  // Putar preview lagu
  const playPreview = () => {
    if (!currentSong?.previewUrl || feedback) return;

    if (audioRef.current) {
      audioRef.current.pause();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    const audio = new Audio(currentSong.previewUrl);
    audioRef.current = audio;

    // Set volume
    audio.volume = isMuted ? 0 : 1;

    // Start from second 0
    audio.currentTime = 0;

    audio.play().catch((err) => {
      console.log("Failed to play:", err);
    });

    setIsPlaying(true);
    startProgressTracking();
  };

  // Pause preview
  const pausePreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Handle user answer
  const handleAnswer = (selectedAnswer) => {
    if (feedback) return;

    const isCorrect = selectedAnswer === currentSong?.trackName;
    setSelectedChoice(selectedAnswer);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }

    // Stop audio and clean up
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setAudioProgress(0);
    setCurrentTime(0);
  };

  // Next question
  const nextQuestion = () => {
    if (round >= maxRounds) {
      const endTime = Date.now();
      setGameEndTime(endTime);
      const gameStats = {
        score: score,
        totalRounds: maxRounds,
        timeSpent: endTime - (gameStartTime || endTime),
        artist: artist?.artistName,
      };
      localStorage.setItem("gameStats", JSON.stringify(gameStats));
      localStorage.setItem("finalScore", score.toString());
      router.push("/result");
      return;
    }
    setRound(round + 1);
    loadNewQuestion();
  };

  // Get button style based on state
  const getButtonStyle = (choice) => {
    let baseStyle =
      "w-full text-left p-4 rounded-xl transition-all duration-300 border ";

    if (!feedback) {
      return (
        baseStyle +
        "bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-slate-200 hover:border-blue-500/50"
      );
    }

    if (choice === currentSong?.trackName) {
      return (
        baseStyle +
        "bg-green-600/30 border-green-500 text-green-300 ring-1 ring-green-500/50"
      );
    }

    if (choice === selectedChoice && feedback === "wrong") {
      return (
        baseStyle +
        "bg-red-600/30 border-red-500 text-red-300 ring-1 ring-red-500/50"
      );
    }

    return baseStyle + "bg-slate-800/30 border-slate-700/50 text-slate-500";
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const secs = Math.floor(seconds);
    return `0:${secs < 10 ? "0" + secs : secs}`;
  };

  if (loading || !currentSong) {
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
            Loading songs...
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
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden min-h-[580px]">
            {/* Header */}
            <div className="relative z-30 p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 rounded-full p-2">
                    <Headphones className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {artist?.artistName}
                    </p>
                    <p className="text-slate-400 text-xs">Guess the song</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-bold">{score}</span>
                    <span className="text-slate-400 text-sm">/{maxRounds}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Round {round}</span>
                  <span className="text-slate-400">of {maxRounds}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(round / maxRounds) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Player Card - Minimalist Design */}
            <div className="relative z-30 p-6 pt-2">
              <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                {/* Audio Player Controls - Minimalist */}
                <div className="flex items-center gap-3">
                  {/* Play/Pause Button */}
                  <button
                    onClick={isPlaying ? pausePreview : playPreview}
                    disabled={!!feedback}
                    className="flex-shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all duration-300 flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  {/* Timeline Container */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {/* Progress Bar */}
                      <div className="flex-1 relative">
                        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${audioProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Timer */}
                      <span className="text-slate-400 text-xs font-mono whitespace-nowrap">
                        {formatTime(currentTime)} / 0:07
                      </span>
                    </div>
                  </div>

                  {/* Mute Button */}
                  <button
                    onClick={toggleMute}
                    className="flex-shrink-0 w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Hint Text */}
                <p className="text-slate-500 text-xs text-center mt-3">
                  7-second preview from the middle of the song
                </p>
              </div>
            </div>

            {/* Choices */}
            <div className="relative z-30 p-6 pt-2 space-y-3">
              {choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(choice)}
                  disabled={!!feedback}
                  className={getButtonStyle(choice)}
                >
                  <div className="flex items-center justify-between">
                    <span>{choice}</span>
                    {feedback && choice === currentSong?.trackName && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {feedback &&
                      choice === selectedChoice &&
                      feedback === "wrong" && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                  </div>
                </button>
              ))}
            </div>

            {/* Next Button */}
            {feedback && (
              <div className="relative z-30 p-6 pt-0">
                <button
                  onClick={nextQuestion}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {round >= maxRounds ? "Finish Game" : "Next Song"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Back Button */}
            {!feedback && (
              <div className="relative z-30 p-6 pt-0">
                <button
                  onClick={() => router.push("/")}
                  className="w-full py-3 text-slate-400 hover:text-white transition-colors duration-300 text-sm flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Change Artist
                </button>
              </div>
            )}
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
