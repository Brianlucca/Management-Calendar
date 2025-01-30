import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../../service/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";

const TagsManager = ({ onTagCreate }) => {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#FF0000");
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser) {
      const newTag = { name: tagName, color: tagColor };
      push(ref(db, `tags/${currentUser.uid}`), newTag)
        .then(() => {
          onTagCreate(newTag);
          setTagName("");
        })
        .catch((error) => {
          console.error("Erro ao salvar tag:", error);
        });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Criar Tag</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Tag"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="color"
          value={tagColor}
          onChange={(e) => setTagColor(e.target.value)}
          className="w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Criar Tag
        </button>
      </form>
    </div>
  );
};

export default TagsManager;