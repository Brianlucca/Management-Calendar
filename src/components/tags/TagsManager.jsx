import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../../service/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { PlusCircle } from "lucide-react";
import { useNotification } from "../notification/Notification"; 


const TagsManager = ({ onTagCreate }) => {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#3B82F6");
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser && tagName.trim()) {
      const newTag = {
        name: tagName,
        color: tagColor,
        createdAt: new Date().toISOString()
      };

      try {
        const tagRef = await push(ref(db, `users/${currentUser.uid}/tags`), newTag);
        onTagCreate({ ...newTag, id: tagRef.key });
        setTagName("");
      } catch (error) {
        showNotification(`Erro ao salvar tag`, "error");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <PlusCircle className="w-6 h-6" />
          Criar Nova Tag
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Tag
          </label>
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Digite o nome da tag"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a Cor
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={tagColor}
              onChange={(e) => setTagColor(e.target.value)}
              className="w-16 h-10 rounded-lg cursor-pointer"
            />
            <span className="text-sm text-gray-600">
              {tagColor.toUpperCase()}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Criar Nova Tag
        </button>
      </form>
    </div>
  );
};

export default TagsManager;