"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Trophy,
  TrendingUp,
  X,
  Edit2,
  Save,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Player {
  id: string;
  name: string;
  totalScore: number;
  rounds: number[];
}

const PigScoreManager = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [showAddPlayer, setShowAddPlayer] = useState<boolean>(false);
  const [showAddRound, setShowAddRound] = useState<boolean>(false);
  const [showPlayerDetail, setShowPlayerDetail] = useState<string | null>(null);
  const [roundScores, setRoundScores] = useState<{ [key: string]: string }>({});
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [editingRound, setEditingRound] = useState<{
    playerId: string;
    roundIndex: number;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [roomCode, setRoomCode] = useState<string>("");
  const [copiedRoom, setCopiedRoom] = useState<boolean>(false);

  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  useEffect(() => {
    const saved = localStorage.getItem("pigScores");
    if (saved) {
      const data = JSON.parse(saved);
      setPlayers(data.players || []);
      setCurrentRound(data.currentRound || 1);
      setRoomCode(id || "");
    }
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(
        "pigScores",
        JSON.stringify({ players, currentRound, roomCode })
      );
    }
  }, [players, currentRound, roomCode]);

  const addPlayer = (): void => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        totalScore: 0,
        rounds: [],
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
      setShowAddPlayer(false);
    }
  };

  const removePlayer = (id: string): void => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const addRound = (): void => {
    const updatedPlayers = players.map((player) => {
      const score = parseInt(roundScores[player.id] || "0");
      return {
        ...player,
        rounds: [...player.rounds, score],
        totalScore: player.totalScore + score,
      };
    });

    setPlayers(updatedPlayers);
    setRoundScores({});
    setCurrentRound(currentRound + 1);
    setShowAddRound(false);
  };

  const handleScoreChange = (playerId: string, value: string): void => {
    setRoundScores({
      ...roundScores,
      [playerId]: value,
    });
  };

  const startEditRound = (
    playerId: string,
    roundIndex: number,
    currentScore: number
  ): void => {
    setEditingRound({ playerId, roundIndex });
    setEditValue(currentScore.toString());
  };

  const saveEditRound = (): void => {
    if (!editingRound) return;

    const { playerId, roundIndex } = editingRound;
    const newScore = parseInt(editValue) || 0;

    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          const oldScore = player.rounds[roundIndex];
          const updatedRounds = [...player.rounds];
          updatedRounds[roundIndex] = newScore;

          return {
            ...player,
            rounds: updatedRounds,
            totalScore: player.totalScore - oldScore + newScore,
          };
        }
        return player;
      })
    );

    setEditingRound(null);
    setEditValue("");
  };

  const cancelEdit = (): void => {
    setEditingRound(null);
    setEditValue("");
  };

  const copyRoomCode = (): void => {
    navigator.clipboard.writeText(roomCode);
    setCopiedRoom(true);
    setTimeout(() => setCopiedRoom(false), 2000);
  };

  const deleteRound = (playerId: string, roundIndex: number): void => {
    if (!confirm("Are you sure you want to delete this round?")) return;

    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          const scoreToRemove = player.rounds[roundIndex];
          const updatedRounds = player.rounds.filter(
            (_, idx) => idx !== roundIndex
          );

          return {
            ...player,
            rounds: updatedRounds,
            totalScore: player.totalScore - scoreToRemove,
          };
        }
        return player;
      })
    );
  };

  const sortedPlayers = [...players].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  const getRankEmoji = (index: number): string => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  const selectedPlayer = players.find((p) => p.id === showPlayerDetail);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 p-4">
      <div className="max-w-4xl mx-auto py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🐷 Pig Chopping Score Manager
          </h1>
          {roomCode && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="bg-white px-4 py-2 rounded-lg shadow-md inline-flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  Room Code:
                </span>
                <span className="text-xl font-bold text-blue-600 tracking-wider">
                  {roomCode}
                </span>
                <button
                  onClick={copyRoomCode}
                  className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                  title="Copy room code"
                >
                  {copiedRoom ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-blue-600" />
                  )}
                </button>
              </div>
            </div>
          )}
          <p className="text-blue-700">Round {currentRound}</p>
        </div>

        {/* Leaderboard */}
        {players.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
            </div>
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl font-bold w-10 text-center">
                      {getRankEmoji(index)}
                    </span>
                    <div>
                      <p className="font-bold text-gray-800">{player.name}</p>
                      <p className="text-sm text-gray-500">
                        {player.rounds.length} rounds played
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {player.totalScore}
                      </p>
                      <p className="text-xs text-gray-500">total points</p>
                    </div>
                    <button
                      onClick={() => setShowPlayerDetail(player.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Players</h2>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Player</span>
            </button>
          </div>

          {players.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No players yet. Add your first player to start!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{player.name}</p>
                    <p className="text-sm text-gray-500">
                      Score: {player.totalScore} pts
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPlayerDetail(player.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Round Button */}
        {players.length > 0 && (
          <button
            onClick={() => setShowAddRound(true)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <TrendingUp size={24} />
            Add Round {currentRound} Scores
          </button>
        )}

        {/* Add Player Modal */}
        {showAddPlayer && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Add New Player
                </h3>
                <button
                  onClick={() => setShowAddPlayer(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                placeholder="Enter player name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddPlayer(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddRound && (
          <div
            className="fixed inset-0  flex items-center justify-center p-4 z-50 overflow-y-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Round {currentRound} Scores
                </h3>
                <button
                  onClick={() => setShowAddRound(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 mb-4">
                {players.map((player) => (
                  <div key={player.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {player.name}
                    </label>
                    <input
                      type="number"
                      value={roundScores[player.id] || ""}
                      onChange={(e) =>
                        handleScoreChange(player.id, e.target.value)
                      }
                      placeholder="Enter score"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddRound(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addRound}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Save Round
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Player Detail Modal */}
        {showPlayerDetail && selectedPlayer && (
          <div
            className="fixed inset-0  flex items-center justify-center p-4 z-50 overflow-y-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedPlayer.name}
                  </h3>
                  <p className="text-gray-600">
                    Total Score:{" "}
                    <span className="font-bold text-blue-600">
                      {selectedPlayer.totalScore}
                    </span>{" "}
                    pts
                  </p>
                </div>
                <button
                  onClick={() => setShowPlayerDetail(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {selectedPlayer.rounds.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No rounds played yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedPlayer.rounds.map((score, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="font-semibold text-gray-700 min-w-[80px]">
                          Round {index + 1}
                        </span>
                        {editingRound?.playerId === selectedPlayer.id &&
                        editingRound?.roundIndex === index ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-3 py-2 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 w-24"
                            autoFocus
                          />
                        ) : (
                          <span className="text-2xl font-bold text-blue-600">
                            {score} pts
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {editingRound?.playerId === selectedPlayer.id &&
                        editingRound?.roundIndex === index ? (
                          <>
                            <button
                              onClick={saveEditRound}
                              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              title="Save"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                startEditRound(selectedPlayer.id, index, score)
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() =>
                                deleteRound(selectedPlayer.id, index)
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowPlayerDetail(null)}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PigScoreManager;
