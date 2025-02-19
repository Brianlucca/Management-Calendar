import React, { useState } from "react";
import TagsManager from "../../components/tags/TagsManager";
import TagsLegend from "../../components/tags/tagsLegend/TagsLegend";

const TagsPage = () => {
  const [tags, setTags] = useState([]);

  const handleTagCreate = (newTag) => {
    setTags(prev => [...prev, newTag]);
  };
  
  const handleTagDelete = (deletedTags) => {
    setTags(tags.filter(tag => !deletedTags.includes(tag.id)));
  };

  return (
    <div className="md:mt-0 mt-16 min-h-screen p-6 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">
        <TagsManager onTagCreate={handleTagCreate} />
        <TagsLegend tags={tags} onTagDelete={handleTagDelete} />
      </div>
    </div>
  );
};

export default TagsPage;