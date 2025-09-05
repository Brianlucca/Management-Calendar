import React, { useState, useContext } from "react";
import { ref, remove } from "firebase/database";
import { db } from "../../service/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Trash2, AlertTriangle, List } from "lucide-react";
import { useNotification } from "../notification/Notification";
import { TagContext } from "../../context/TagContext";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TagsLegend = ({ onTagDelete }) => {
  const { currentUser } = useAuth();
  const { tags } = useContext(TagContext);
  const { showNotification } = useNotification();
  
  const [tagToDelete, setTagToDelete] = useState(null);

  const handleDelete = async (tagId) => {
    if (currentUser && tagId) {
      try {
        await remove(ref(db, `users/${currentUser.uid}/tags/${tagId}`));
        if (onTagDelete) {
          onTagDelete([tagId]);
        }
        setTagToDelete(null);
        showNotification("Tag excluída com sucesso!", "success");
      } catch (error) {
        showNotification("Erro ao excluir a tag", "error");
        setTagToDelete(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6 lg:p-8">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <List className="w-6 h-6 text-indigo-500" />
          Suas Tags
        </h2>
        <p className="text-slate-500 mt-1">Visualize e remova as tags existentes.</p>
      </header>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800">{tag.name}</span>
                  <span className="text-xs text-slate-500">
                    Criada em {format(parseISO(tag.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setTagToDelete(tag)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-slate-500">Nenhuma tag criada ainda.</p>
        )}
      </div>

      {tagToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Excluir Tag</h3>
            <p className="text-slate-500 mt-2">
              Tem certeza que deseja excluir a tag "<strong>{tagToDelete.name}</strong>"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setTagToDelete(null)}
                className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(tagToDelete.id)}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsLegend;