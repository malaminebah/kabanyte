"use client";

import { useState } from "react";
import { FaCircleMinus } from "react-icons/fa6";
import { LABELS, type LabelType, type Card } from "@/types";

type CardModalProps = {
  card: Card;
  onClose: () => void;
  onSave: (cardId: string, updates: { description: string; labels: LabelType[] }) => void;
};

export default function CardModal({ card, onClose, onSave }: CardModalProps) {
  const [editedDescription, setEditedDescription] = useState(card.description);
  const [selectedLabels, setSelectedLabels] = useState<LabelType[]>(card.labels || []);

  const toggleLabel = (label: LabelType) => {
    setSelectedLabels(prev => 
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-medium text-gray-900 dark:text-white">{card.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <FaCircleMinus size={20} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Labels
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LABELS).map(([key, label]) => (
              <button
                key={label.id}
                onClick={() => toggleLabel(key as LabelType)}
                className={`px-4 py-1.5 rounded-full text-white text-sm transition-all
                  ${label.color} 
                  ${selectedLabels.includes(key as LabelType) 
                    ? 'ring-2 ring-offset-2 ring-gray-400' 
                    : 'opacity-60 hover:opacity-100'}`}
              >
                {label.text}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Description
          </label>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-4 border-0 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 
                     text-gray-900 dark:text-white backdrop-blur-sm
                     focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onSave(card.id, {
                description: editedDescription,
                labels: selectedLabels
              });
              onClose();
            }}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-full
                     hover:bg-blue-600 transition-colors shadow-lg"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
} 