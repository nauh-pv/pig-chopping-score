"use client";
import React, { useState } from "react";
import { Users, LogIn, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
type TabType = "create" | "join";

const HomePage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("create");
  const [roomCode, setRoomCode] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleRedirect = (code: string) => {
    router.push(`/score-manager/${code}`);
  };

  const generateRoomCode = (): void => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setCopied(false);
    handleRedirect(code);
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinRoom = (): void => {
    if (joinCode.trim()) {
      alert(`Joining room: ${joinCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
            🐷 Pig Chopping Score
          </h1>
          <p className="text-blue-700 text-sm md:text-base">
            Create or join a room to start scoring
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex bg-gradient-to-r from-blue-50 to-purple-50">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 ${
                activeTab === "create"
                  ? "bg-white text-blue-600 border-b-4 border-blue-600"
                  : "text-gray-600 hover:bg-white/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users size={20} />
                <span className="hidden sm:inline">Create Room</span>
                <span className="sm:hidden">Create</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("join")}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 ${
                activeTab === "join"
                  ? "bg-white text-blue-600 border-b-4 border-blue-600"
                  : "text-gray-600 hover:bg-white/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <LogIn size={20} />
                <span className="hidden sm:inline">Join Room</span>
                <span className="sm:hidden">Join</span>
              </div>
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "create" ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Create New Room
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Generate a unique code to share with others
                  </p>
                </div>

                {roomCode && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Your Room Code:
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-3xl md:text-4xl font-bold text-blue-600 tracking-wider">
                        {roomCode}
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="Copy code"
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-green-600 text-sm mt-2 font-medium">
                        ✓ Copied to clipboard!
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={generateRoomCode}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {roomCode ? "Generate New Code" : "Generate Room Code"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Join Existing Room
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Enter the room code to join
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setJoinCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-4 text-xl md:text-2xl font-bold text-center border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all tracking-wider uppercase"
                  />
                </div>

                <button
                  onClick={handleJoinRoom}
                  disabled={joinCode.length < 6}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform shadow-lg ${
                    joinCode.length >= 6
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Join Room
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-blue-600 text-sm">
            Ready to track your pig chopping scores! 🎯
          </p>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
