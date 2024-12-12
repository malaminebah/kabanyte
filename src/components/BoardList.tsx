"use client";

import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";

export type BoardType = {
  id: string;
  name: string;
};

type BoardListProps = {
  onSelectBoard: (boardId: string) => void;
  selectedBoardId: string;
};

export default function BoardList({ onSelectBoard, selectedBoardId }: BoardListProps) {
  const [boards, setBoards] = useState<BoardType[]>([
    { id: "1", name: "Board Principal" },
    { id: "2", name: "Board Projet A" },
  ]);
  const [newBoardName, setNewBoardName] = useState("");
  const [isAddingBoard, setIsAddingBoard] = useState(false);

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      const newBoard = {
        id: Date.now().toString(),
        name: newBoardName,
      };
      setBoards([...boards, newBoard]);
      setNewBoardName("");
      setIsAddingBoard(false);
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    setBoards(boards.filter((board) => board.id !== boardId));
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mes Boards</h2>
        <button
          onClick={() => setIsAddingBoard(true)}
          className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
        >
          <FaPlus />
        </button>
      </div>

      {isAddingBoard && (
        <div className="mb-4">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Nom du board"
            className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-700 
                     border-gray-200 dark:border-gray-600
                     text-gray-900 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddBoard}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm
                       hover:bg-blue-600 dark:hover:bg-blue-400"
            >
              Ajouter
            </button>
            <button
              onClick={() => setIsAddingBoard(false)}
              className="text-gray-600 dark:text-gray-300 px-3 py-1 rounded text-sm
                       hover:text-gray-800 dark:hover:text-gray-100"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {boards.map((board) => (
          <div
            key={board.id}
            className={`flex justify-between items-center p-2 rounded cursor-pointer
              ${selectedBoardId === board.id 
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            onClick={() => onSelectBoard(board.id)}
          >
            <span className="truncate">{board.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBoard(board.id);
              }}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 