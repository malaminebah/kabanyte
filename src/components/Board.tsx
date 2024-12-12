"use client";

import { useState, useRef } from "react";
import { FaPlusCircle, FaThLarge, FaThList } from "react-icons/fa";
import { FaCircleMinus, FaTrash } from "react-icons/fa6";
import ThemeToggle from "@/components/ThemeToggle";

const LABELS = {
  FRONT: { id: 'front', text: 'Frontend', color: 'bg-sky-400 dark:bg-sky-500' },
  BACK: { id: 'back', text: 'Backend', color: 'bg-emerald-400 dark:bg-emerald-500' },
  BUG: { id: 'bug', text: 'Bug', color: 'bg-rose-400 dark:bg-rose-500' },
  FEATURE: { id: 'feature', text: 'Feature', color: 'bg-violet-400 dark:bg-violet-500' },
  UI: { id: 'ui', text: 'UI/UX', color: 'bg-amber-400 dark:bg-amber-500' },
} as const;

type LabelType = keyof typeof LABELS;

type Attachment = {
  id: string;
  name: string;
  url: string;
  type: string;
};

type Card = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  boardId: string;
  labels: LabelType[];
  attachments: Attachment[];
};

type Column = {
  id: string;
  title: string;
  boardId: string;
};

function CardModal({ card, onClose, onSave }: {
  card: Card;
  onClose: () => void;
  onSave: (cardId: string, updates: { description: string; labels: LabelType[]; attachments: Attachment[] }) => void;
}) {
  const [editedDescription, setEditedDescription] = useState(card.description);
  const [selectedLabels, setSelectedLabels] = useState<LabelType[]>(card.labels || []);
  const [attachments, setAttachments] = useState<Attachment[]>(card.attachments || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLabel = (label: LabelType) => {
    setSelectedLabels(prev => 
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const newAttachments: Attachment[] = [];
    
    for (const file of files) {
      // Dans un cas réel, vous uploaderiez le fichier sur un serveur
      // et récupéreriez l'URL. Ici on crée une URL locale temporaire
      const url = URL.createObjectURL(file);
      
      newAttachments.push({
        id: Date.now().toString(),
        name: file.name,
        url: url,
        type: file.type,
      });
    }

    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter(a => a.id !== attachmentId));
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pièces jointes
          </label>
          <div className="space-y-2">
            {attachments.map(attachment => (
              <div 
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <a 
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                  >
                    {attachment.name}
                  </a>
                </div>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 
                     text-gray-700 dark:text-gray-300 rounded-lg
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            + Ajouter un fichier
          </button>
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
                labels: selectedLabels,
                attachments: attachments
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
      attachments: [] 
    },
    { id: "2", title: "Tâche 2", description: "Description 2", columnId: "inProgress", boardId, labels: [], attachments: [] },
    { id: "3", title: "Tâche 3", description: "Description 3", columnId: "done", boardId, labels: [], attachments: [] },
    { id: "4", title: "Tâche 4", description: "Description 4", columnId: "review", boardId, labels: [], attachments: [] },
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
    updates: { description: string; labels: LabelType[]; attachments: Attachment[] }
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
        />
      )}
    </div>
  );
}
