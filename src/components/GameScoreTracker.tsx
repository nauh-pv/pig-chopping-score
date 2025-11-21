"use client";
import React, { useState, useEffect } from "react";
import { saveScore, getScores } from "../firebase/firebase"; // Import hàm lưu điểm Firebase

const GameScoreTracker: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [players, setPlayers] = useState<{ name: string; score: string }[]>([]);
  const [groupCode, setGroupCode] = useState<string>("");
  const [dbPlayers, setDbPlayers] = useState<{ name: string; score: string }[]>(
    []
  );

  // Thêm người chơi vào danh sách
  const addPlayer = () => {
    if (name && score) {
      setPlayers([...players, { name, score }]);
      setName("");
      setScore("");
    }
  };

  // Tạo mã nhóm và lưu vào Firebase
  const generateGroupCode = () => {
    const code = Math.random().toString(36).substring(2, 8);
    setGroupCode(code);
    saveScore(code, players); // Lưu điểm vào Firebase
  };

  // Lấy dữ liệu từ Firebase khi groupCode thay đổi
  useEffect(() => {
    if (groupCode) {
      getScores(groupCode)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setDbPlayers(snapshot.val().players);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [groupCode]);

  return (
    <div>
      <h1>Game Score Tracker</h1>
      <div>
        <input
          type="text"
          placeholder="Enter player's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <button onClick={addPlayer}>Add Player</button>
      </div>
      <div>
        <h2>Players:</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index}>
              {player.name} - {player.score}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={generateGroupCode}>Generate Group Code</button>
        <p>Group Code: {groupCode}</p>
      </div>

      <div>
        <h2>Players from Firebase:</h2>
        <ul>
          {dbPlayers.length > 0 ? (
            dbPlayers.map((player, index) => (
              <li key={index}>
                {player.name} - {player.score}
              </li>
            ))
          ) : (
            <li>No players found in Firebase</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GameScoreTracker;
