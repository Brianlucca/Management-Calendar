import React from "react";
import TagsManager from "../../components/tags/TagsManager";
import TagsLegend from "../../components/tags/tagsLegend/TagsLegend";

const TagsPage = () => {
  return (
    <div className="md:mt-0 mt-16 min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Tags</h1>
          <p className="text-gray-600">Crie e gerencie suas tags personalizadas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TagsManager />
          </div>
          <div>
            <TagsLegend />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsPage;