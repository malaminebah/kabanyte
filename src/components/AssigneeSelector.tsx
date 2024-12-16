import { useState } from "react";
import { User } from "@/data/users";
import { FaPlus, FaXmark } from "react-icons/fa6";

type AssigneeSelectorProps = {
  assignees: User[];
  onAssigneeChange: (assignees: User[]) => void;
  users: User[];
  onAddNewUser: (user: Omit<User, 'id'>) => void;
};

const AVATARS = ['👨‍💻', '👩‍💼', '👨‍🚀', '👩‍🔬', '👨‍🎨', '👩‍🏫', '🧑‍💻', '👩‍🌾', '👨‍🍳', '👩‍🔧'];

export default function AssigneeSelector({ 
  assignees, 
  onAssigneeChange, 
  users,
  onAddNewUser 
}: AssigneeSelectorProps) {
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const toggleAssignee = (user: User) => {
    const isAssigned = assignees.some(a => a.id === user.id);
    if (isAssigned) {
      onAssigneeChange(assignees.filter(a => a.id !== user.id));
    } else {
      onAssigneeChange([...assignees, user]);
      setIsAddingMode(false);
    }
  };

  const handleCreateUser = () => {
    if (newUserName.trim()) {
      onAddNewUser({
        name: newUserName.trim(),
        avatar: selectedAvatar
      });
      setNewUserName("");
      setSelectedAvatar(AVATARS[0]);
      setIsCreatingUser(false);
    }
  };

  const availableUsers = users.filter(user => !assignees.some(a => a.id === user.id));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {assignees.map(user => (
          <button
            key={user.id}
            onClick={() => toggleAssignee(user)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all
              bg-blue-500 text-white ring-2 ring-offset-2 ring-blue-400"
            title="Retirer"
          >
            <span className="text-lg">{user.avatar}</span>
            {user.name}
          </button>
        ))}
        {!isAddingMode && !isCreatingUser && (
          <button
            onClick={() => setIsAddingMode(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                     bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            <FaPlus />
            Ajouter
          </button>
        )}
      </div>

      {isAddingMode && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Sélectionnez un utilisateur à ajouter :
            </div>
            <button
              onClick={() => setIsAddingMode(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FaXmark />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableUsers.map(user => (
              <button
                key={user.id}
                onClick={() => toggleAssignee(user)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                         bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                         hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                <span className="text-lg">{user.avatar}</span>
                {user.name}
              </button>
            ))}
            <button
              onClick={() => {
                setIsAddingMode(false);
                setIsCreatingUser(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                       bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                       hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
            >
              <FaPlus />
              Nouveau utilisateur
            </button>
          </div>
        </div>
      )}

      {isCreatingUser && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Créer un nouvel utilisateur
            </div>
            <button
              onClick={() => setIsCreatingUser(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FaXmark />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-8 h-8 text-lg rounded-full flex items-center justify-center
                              transition-all ${
                                selectedAvatar === avatar
                                  ? 'bg-blue-500 text-white ring-2 ring-offset-2 ring-blue-400'
                                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-600 
                         border border-gray-200 dark:border-gray-500
                         text-gray-900 dark:text-white"
                placeholder="Nom de l'utilisateur"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreatingUser(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300
                         hover:text-gray-800 dark:hover:text-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateUser}
                disabled={!newUserName.trim()}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg
                         hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 