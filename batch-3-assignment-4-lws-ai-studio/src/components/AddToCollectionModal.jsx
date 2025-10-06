import React, { useState } from "react";
import { useCollections } from "../context/CollectionsContext";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

const AddToCollectionModal = ({ image, onClose }) => {
  const { state, dispatch } = useCollections();
  const { collections } = state;
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleAddToCollection = (collectionId) => {
    dispatch({
      type: "ADD_IMAGE_TO_COLLECTION",
      payload: { collectionId, image },
    });
    onClose();
  };

  const handleCreateAndAdd = () => {
    if (newCollectionName.trim() === "") return;
    const newId = `coll_${Date.now()}`;
    dispatch({
      type: "CREATE_COLLECTION",
      payload: { id: newId, name: newCollectionName.trim() },
    });
    dispatch({
      type: "ADD_IMAGE_TO_COLLECTION",
      payload: { collectionId: newId, image },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 text-white w-full max-w-sm p-6 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add to Collection</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {Object.values(collections).length > 0 ? (
            Object.values(collections).map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleAddToCollection(collection.id)}
                className="w-full text-left px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition"
              >
                {collection.name}
              </button>
            ))
          ) : (
            <p className="text-zinc-500 text-sm">
              No collections yet. Create one below!
            </p>
          )}
        </div>

        <div className="border-t border-zinc-700 pt-4">
          <p className="text-sm font-medium mb-2 text-zinc-300">
            Create a new collection
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="e.g. 'Sci-Fi Art'"
              className="w-full bg-zinc-800 px-3 py-2 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
            />
            <button
              onClick={handleCreateAndAdd}
              className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-500 disabled:opacity-50"
              disabled={!newCollectionName.trim()}
            >
              <CheckIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;
