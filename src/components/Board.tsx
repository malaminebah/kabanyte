"use client";

import { useState } from "react";
import { FaPlusCircle, FaThLarge, FaThList } from "react-icons/fa";
import { FaCircleMinus, FaTrash } from "react-icons/fa6";
import ThemeToggle from "@/components/ThemeToggle";
import CardModal from "./CardModal";
import { LABELS, type Card, type Column, type LabelType, type Attachment } from "@/types";
import { USERS, type User } from "@/data/users";

export default function Board({ boardId }: { boardId: string }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openColmunId, setOpenColmunId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "À faire", boardId },
    { id: "inProgress", title: "En cours", boardId },
    { id: "done", title: "Terminé", boardId },
    { id: "review", title: "À revoir", boardId },
  ]);

  const [cards, setCards] = useState<Card[]>([
    { 
      id: "1", 
      title: "Tâche 1", 
      description: "Description 1", 
      columnId: "todo", 
      boardId, 
      labels: [],
      attachments: [],
      assignees: [] 
    },
    { id: "2", title: "Tâche 2", description: "Description 2", columnId: "inProgress", boardId, labels: [], attachments: [], assignees: [] },
    { id: "3", title: "Tâche 3", description: "Description 3", columnId: "done", boardId, labels: [], attachments: [], assignees: [] },
    { id: "4", title: "Tâche 4", description: "Description 4", columnId: "review", boardId, labels: [], attachments: [], assignees: [] },
  ]);

  const filteredColumns = columns.filter(column => column.boardId === boardId);
  const filteredCards = cards.filter(card => card.boardId === boardId);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("cardId", cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    setCards(cards.map((card) => (card.id === cardId ? { ...card, columnId } : card)));
  };

  const handleAddCard = (columnId: string) => {
    if (newCardTitle.trim()) {
      const newCard = {
        id: Date.now().toString(),
        title: newCardTitle,
        description: newCardDescription,
        columnId: columnId,
        boardId,
        labels: [],
        attachments: [],
        assignees: [],
      };
      setCards([...cards, newCard]);
      setNewCardTitle("");
      setNewCardDescription("");
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = {
        id: Date.now().toString(),
        title: newColumnTitle,
        boardId,
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(column => column.id !== columnId));
    setCards(cards.filter(card => card.columnId !== columnId));
  };

  const handleSaveCardModal = (
    cardId: string, 
    updates: { description: string; labels: LabelType[]; attachments: Attachment[]; assignees: User[] }
  ) => {
    setCards(cards.map(card => 
      card.id === cardId 
        ? { ...card, ...updates }
        : card
    ));
  };

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-medium text-gray-900 dark:text-white">Board</h1>
          {isAddingColumn ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Nom de la colonne"
                className="px-4 py-2 rounded-full border-0 bg-gray-50 dark:bg-gray-700
                         text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleAddColumn}
                className="bg-blue-500 text-white px-6 py-2 rounded-full 
                         hover:bg-blue-600 transition-colors shadow-lg"
              >
                Ajouter
              </button>
              <button
                onClick={() => setIsAddingColumn(false)}
                className="text-gray-600 dark:text-gray-300 px-6 py-2 transition-colors"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 transition-colors"
            >
              + Nouvelle colonne
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex gap-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-colors
                ${viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-700 text-blue-500' 
                  : 'text-gray-600 dark:text-gray-300'}`}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-colors
                ${viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-700 text-blue-500' 
                  : 'text-gray-600 dark:text-gray-300'}`}
            >
              <FaThList />
            </button>
          </div>
        </div>
      </div>

      <div className={`
        ${viewMode === 'grid' 
          ? 'grid auto-cols-[minmax(300px,1fr)] grid-flow-col gap-6 overflow-x-auto pb-8' 
          : 'flex flex-col space-y-6'
        }
      `}>
        {filteredColumns.map((column) => (
          <div
            key={column.id}
            className={`
              bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6
              ${viewMode === 'grid' 
                ? 'min-h-[calc(100vh-200px)]' 
                : 'min-h-[200px]'
              }
            `}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-slate-700 dark:text-white">
                {column.title}
              </h2>
              <button
                onClick={() => handleDeleteColumn(column.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Supprimer la colonne"
              >
                <FaTrash size={14} />
              </button>
            </div>

            <div className="mb-4">
              {openColmunId === column.id && (
                <div>
                  <input
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="Titre"
                    className="w-full p-2 mb-2 rounded border dark:bg-gray-700 dark:text-white"
                  />
                  <textarea
                    value={newCardDescription}
                    onChange={(e) => setNewCardDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 mb-2 rounded border dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                  <button
                    onClick={() => handleAddCard(column.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Ajouter
                  </button>
                </div>
              )}
              <button
                onClick={() => setOpenColmunId(column.id === openColmunId ? null : column.id)}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {openColmunId === column.id ? <FaCircleMinus /> : <FaPlusCircle />}
              </button>
            </div>

            <div className="space-y-3">
              {filteredCards
                .filter((card) => card.columnId === column.id)
                .map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    onClick={() => setSelectedCard(card)}
                    className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm cursor-move
                              hover:shadow-md transition-all duration-200
                              border border-slate-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-800 dark:text-white">{card.title}</h3>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {card.labels?.map(labelKey => (
                            <span
                              key={labelKey}
                              className={`px-2 py-0.5 rounded-full text-white text-xs ${LABELS[labelKey].color}`}
                            >
                              {LABELS[labelKey].text}
                            </span>
                          ))}
                        </div>
                        {card.assignees?.length > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex -space-x-2">
                              {card.assignees.slice(0, 3).map(user => (
                                <div
                                  key={user.id}
                                  className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center
                                            text-sm border-2 border-white dark:border-gray-800"
                                  title={user.name}
                                >
                                  {user.avatar}
                                </div>
                              ))}
                            </div>
                            {card.assignees.length > 3 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{card.assignees.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">
                          {card.description}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteCard(card.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Supprimer la carte"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onSave={handleSaveCardModal}
          users={USERS}
        />
      )}
    </div>
  );
}
