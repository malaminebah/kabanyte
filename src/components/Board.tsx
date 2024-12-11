"use client";

import { useState } from "react";

export default function Board() {
  const [openColmunId, setOpenColmunId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");

  const columns = [
    { id: "todo", title: "À faire" },
    { id: "inProgress", title: "En cours" },
    { id: "done", title: "Terminé" },
    { id: "review", title: "À revoir" },
  ] as const;

  const [cards, setCards] = useState([
    {
      id: "1",
      title: "Tâche 1",
      description: "Description 1",
      columnId: "todo",
    },
    {
      id: "2",
      title: "Tâche 2",
      description: "Description 2",
      columnId: "inProgress",
    },
    {
      id: "3",
      title: "Tâche 3",
      description: "Description 3",
      columnId: "done",
    },
    {
      id: "4",
      title: "Tâche 4",
      description: "Description 4",
      columnId: "review",
    },
  ]);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("cardId", cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAddCard = (columnId: string) => {
    if (newCardTitle.trim()) {
      const newCard = {
        id: Date.now().toString(),
        title: newCardTitle,
        description: newCardDescription,
        columnId: columnId,
      };
      setCards([...cards, newCard]);
      setNewCardTitle("");
      setNewCardDescription("");
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");

    setCards(
      cards.map((card) => (card.id === cardId ? { ...card, columnId } : card))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Board</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-slate-100 rounded-lg p-4 min-h-[calc(100vh-200px)]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <h2 className="font-semibold mb-4 text-slate-700">
              {column.title}
            </h2>

            <div className="mb-4">
              {openColmunId === column.id && (
                <div>
                  <input
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="Titre"
                    className="w-full p-2 mb-2 rounded border"
                  />
                  <button
                    onClick={() => handleAddCard(column.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Ajouter
                  </button>
                </div>
              )}
              {/* ajouter des icon ouvrir et fermer */}
              <button
                onClick={() => setOpenColmunId(column.id === openColmunId ? null : column.id)}
                className="text-gray-700 hover:text-white"
              >
                {openColmunId === column.id ? "Fermer" : "Ajouter"}
              </button>
            </div>

            <div className="space-y-3">
              {cards
                .filter((card) => card.columnId === column.id)
                .map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    className="bg-white rounded-lg p-3 shadow-sm cursor-move 
                             hover:shadow-md transition-all duration-200
                             border border-slate-200"
                  >
                    <h3 className="font-medium text-slate-800">{card.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {card.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
