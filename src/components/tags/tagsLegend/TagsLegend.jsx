import React, { useState, useEffect } from "react";
import { ref, remove, onValue } from "firebase/database";
import { db } from "../../../service/FirebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import { Trash2 } from "lucide-react";
import moment from "moment";
import { useNotification } from "../../notification/Notification";


const TagsLegend = ({ onTagDelete }) => {
  const { currentUser } = useAuth();
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (currentUser) {
      const tagsRef = ref(db, `users/${currentUser.uid}/tags`);
      onValue(tagsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTags(Object.keys(data).map(key => ({ id: key, ...data[key] })));
        }
      });
    }
  }, [currentUser]);

  const handleDeleteSelected = async () => {
    if (currentUser && selectedTags.length > 0) {
      try {
        await Promise.all(
          selectedTags.map(tagId => remove(ref(db, `users/${currentUser.uid}/tags/${tagId}`)))
        );
  
        if (onTagDelete) {
          onTagDelete(selectedTags);
        }        setSelectedTags([]);
        setShowModal(false);
  
        showNotification("Tags excluídas com sucesso!", "success");
  
      } catch (error) {
        showNotification("Erro ao excluir tags", "error");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Suas Tags</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          <span>Excluir Tags</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tag</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Cor</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Criada em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{tag.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-sm text-gray-600">{tag.color.toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {moment(tag.createdAt).format("DD/MM/YYYY HH:mm")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Excluir Tags</h3>
            <div className="space-y-4 mb-6">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => setSelectedTags(prev =>
                      prev.includes(tag.id)
                        ? prev.filter(id => id !== tag.id)
                        : [...prev, tag.id]
                    )}
                    className="w-4 h-4 text-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.name}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg"
              >
                Excluir Selecionadas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsLegend;