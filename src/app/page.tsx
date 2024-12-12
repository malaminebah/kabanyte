"use client";

import { useState } from "react";
import Board from "@/components/Board";
import BoardList from "@/components/BoardList";

export default function Home() {
  const [selectedBoardId, setSelectedBoardId] = useState("1");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex">
        <BoardList
          selectedBoardId={selectedBoardId}
          onSelectBoard={setSelectedBoardId}
        />
        <div className="flex-1">
          <Board boardId={selectedBoardId} />
        </div>
      </div>
    </div>
  );
}
