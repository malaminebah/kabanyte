"use client";
import BoardCard from "./BoardCard";
import LABELS from "./Board";
import { FaTrash, FaCircle, FaCircleMinus } from "react-icons/fa6";
type Column = {
  id: string;
  title: string;
  boardId: string;
};

type Card = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  boardId: string;
  labels: LabelType[];
};

type LabelType = keyof typeof LABELS;

type BoardColumnProps = {
  column: Column;
  cards: Card[];
  isOpen: boolean;
  onDelete: () => void;
  onToggle: () => void;
  onDrop: (e: React.DragEvent) => void;
  onAddCard: () => void;
  onDeleteCard: (cardId: string) => void;
  onCardClick: (card: Card) => void;
  viewMode: 'grid' | 'list';
  newCardTitle: string;
  newCardDescription: string;
  onNewCardTitleChange: (value: string) => void;
  onNewCardDescriptionChange: (value: string) => void;
};

export default function BoardColumn({
  column,
  cards,
  isOpen,
  onDelete,
  onToggle,
  onDrop,
  onAddCard,
  onDeleteCard,
  onCardClick,
  viewMode,
  newCardTitle,
  newCardDescription,
  onNewCardTitleChange,
  onNewCardDescriptionChange,
}: BoardColumnProps) {
  return (
    <div
      className={`
        bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6
        ${viewMode === 'grid' 
          ? 'min-h-[calc(100vh-200px)]' 
          : 'min-h-[200px]'
        }
      `}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-slate-700 dark:text-white">
          {column.title}
        </h2>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 p-1"
          title="Supprimer la colonne"
        >
          <FaTrash size={14} />
        </button>
      </div>

      <div className="mb-4">
        {isOpen && (
          <div>
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => onNewCardTitleChange(e.target.value)}
              placeholder="Titre"
              className="w-full p-2 mb-2 rounded border dark:bg-gray-700 dark:text-white"
            />
            <textarea
              value={newCardDescription}
              onChange={(e) => onNewCardDescriptionChange(e.target.value)}
              placeholder="Description"
              className="w-full p-2 mb-2 rounded border dark:bg-gray-700 dark:text-white"
              rows={3}
            />
            <button
              onClick={onAddCard}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Ajouter
            </button>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          {isOpen ? <FaCircleMinus /> : <FaCircle />}
        </button>
      </div>

      <div className="space-y-3">
        {cards.map((card) => (
          <BoardCard
            key={card.id}
            card={card}
            onDelete={onDeleteCard}
            onClick={() => onCardClick(card)}
            onDragStart={(e) => {
              e.dataTransfer.setData("cardId", card.id);
            }}
          />
        ))}
      </div>
    </div>
  );
} 