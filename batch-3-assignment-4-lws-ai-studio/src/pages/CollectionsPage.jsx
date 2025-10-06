import React from "react";
import { useCollections } from "../context/CollectionsContext";
import ImageCard from "../components/ImageCard";
import { TrashIcon } from "@heroicons/react/24/outline";

const CollectionsPage = () => {
  const { state, dispatch } = useCollections();
  const collections = Object.values(state.collections);

  const handleRemoveFromCollection = (collectionId, imageId) => {
    dispatch({
      type: "REMOVE_IMAGE_FROM_COLLECTION",
      payload: { collectionId, imageId },
    });
  };

  const handleDeleteCollection = (collectionId) => {
    if (
      window.confirm("Are you sure you want to delete this entire collection?")
    ) {
      dispatch({ type: "DELETE_COLLECTION", payload: collectionId });
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8">
        Your Collections <span className="text-2xl">📚</span>
      </h2>

      {collections.length === 0 ? (
        <div className="flex items-center justify-center text-center h-64 border-2 border-dashed border-zinc-800 rounded-xl">
          <p className="text-zinc-500">
            You haven't created any collections yet.
            <br />
            Find an image you like and click the 'Add to Collection' icon!
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {collections.map((collection) => (
            <div key={collection.id}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-zinc-200">
                  {collection.name}
                </h3>
                <button
                  onClick={() => handleDeleteCollection(collection.id)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-red-400 rounded-md hover:bg-red-500/10 transition"
                  title="Delete Collection"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>

              {collection.images.length === 0 ? (
                <p className="text-zinc-500 italic">
                  This collection is empty.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {collection.images.map((image) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onRemoveFromCollection={handleRemoveFromCollection}
                      collectionId={collection.id}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
