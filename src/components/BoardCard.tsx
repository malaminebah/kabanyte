"use client";

import { FaTrash } from "react-icons/fa6";
import LABELS from "../components/Board";
type Card = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  boardId: string;
  labels: LabelType[];
};
type LabelType = keyof typeof LABELS;

type BoardCardProps = {
  card: Card;
  onDelete: (cardId: string) => void;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
};

export default function BoardCard({ card, onDelete, onClick, onDragStart }: BoardCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
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
                className="px-2 py-0.5 rounded-full text-white text-xs bg-blue-500"
              >
                {LABELS[labelKey]}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">
            {card.description}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="text-red-500 hover:text-red-700 p-1"
          title="Supprimer la carte"
        >
          <FaTrash size={12} />
        </button>
      </div>
    </div>
  );
} 