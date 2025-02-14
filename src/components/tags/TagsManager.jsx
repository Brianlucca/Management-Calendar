import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../../service/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Tag, Palette, PlusCircle } from "lucide-react";

const TagsManager = ({ onTagCreate }) => {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#FF0000");
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser) {
      const newTag = { name: tagName, color: tagColor, createdBy: currentUser.email };
      try {
        await push(ref(db, `calendar/tags`), newTag);
        onTagCreate(newTag);
        setTagName("");
      } catch (error) {
        console.error("Erro ao salvar tag:", error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-semibold mb-5 text-gray-800 flex items-center">
        <Palette className="mr-2" /> Criar Nova Tag
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium mb-1 flex items-center">
            <Tag className="mr-2" /> Nome da Tag
          </label>
          <input
            type="text"
            placeholder="Digite o nome da tag..."
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1 flex items-center">
            <Palette className="mr-2" /> Cor da Tag
          </label>
          <input
            type="color"
            value={tagColor}
            onChange={(e) => setTagColor(e.target.value)}
            className="w-full h-8"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition-all flex items-center justify-center"
        >
          <PlusCircle className="mr-2" /> Criar Tag
        </button>
      </form>
    </div>
  );
};

export default TagsManager;