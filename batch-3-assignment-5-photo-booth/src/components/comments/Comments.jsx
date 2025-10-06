import React, { useState } from "react";
import CommentItem from "./CommentItem";

const Comments = ({ comments }) => {
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);

  return (
    <div className="comments-section flex-grow p-3 border-b border-gray-200 dark:border-slate-800">
      <h3 className="font-bold pb-4">Comments</h3>

      {comments?.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            selectedCommentId={selectedCommentId}
            setSelectedCommentId={setSelectedCommentId}
            editCommentId={editCommentId}
            setEditCommentId={setEditCommentId}
          />
        ))
      )}
    </div>
  );
};

export default Comments;
