import React, { useState, useEffect } from "react";
import { ref, remove, onValue } from "firebase/database";
import { db } from "../../../service/FirebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import { Trash2 } from "lucide-react";

const TagsLegend = ({ onTagDelete }) => {
  const { currentUser } = useAuth();
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const tagsRef = ref(db, "/tags");
    onValue(tagsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedTags = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTags(loadedTags);
      }
    });
  }, []);

  const handleTagSelect = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleDeleteSelected = async () => {
    if (currentUser && selectedTags.length > 0) {
      try {
        await Promise.all(
          selectedTags.map(tagId => remove(ref(db, `tags/${tagId}`)))
        );
        onTagDelete(selectedTags);
        setSelectedTags([]);
        setShowModal(false);
      } catch (error) {
        console.error("Erro ao excluir tags:", error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">📌 Legenda de Tags</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <Trash2 size={20} /> Excluir
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Nome da Tag</th>
              <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Cor da Tag</th>
              <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Criador</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{tag.name}</td>
                <td className="py-3 px-4 border-b">
                  <span
                    className="inline-block w-5 h-5 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></span>
                </td>
                <td className="py-3 px-4 border-b">{tag.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Selecionar Tags para Excluir</h3>
            <div className="grid grid-cols-1 gap-4">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{tag.name}</span>
                  <button
                    onClick={() => handleTagSelect(tag.id)}
                    className={`p-1 rounded-lg ${selectedTags.includes(tag.id) ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
                  >
                    {selectedTags.includes(tag.id) ? 'Selecionado' : 'Selecionar'}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-all"
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