import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../../service/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Tag } from "lucide-react";
import { useNotification } from "../notification/Notification";

const TagsManager = ({ onTagCreate }) => {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#4f46e5");
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser && tagName.trim()) {
      const newTag = {
        name: tagName,
        color: tagColor,
        createdAt: new Date().toISOString(),
      };

      try {
        const tagRef = await push(ref(db, `users/${currentUser.uid}/tags`), newTag);
        if (onTagCreate) {
          onTagCreate({ ...newTag, id: tagRef.key });
        }
        setTagName("");
        showNotification("Tag criada com sucesso!", "success");
      } catch (error) {
        showNotification("Erro ao salvar tag", "error");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6 lg:p-8 h-fit">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Tag className="w-6 h-6 text-indigo-500" />
          Criar Nova Tag
        </h2>
        <p className="text-slate-500 mt-1">Adicione uma nova tag para organizar seus eventos.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="tagName" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Nome da Tag
          </label>
          <input
            id="tagName"
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Ex: Trabalho"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Cor
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-slate-200">
              <input
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="absolute inset-0 w-full h-full cursor-pointer border-none"
              />
            </div>
            <span className="text-base font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded">
              {tagColor.toUpperCase()}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md shadow-indigo-500/20"
        >
          Criar Tag
        </button>
      </form>
    </div>
  );
};

export default TagsManager;