import React from "react";
import { AiOutlineMessage } from "react-icons/ai";
import Button from "../ui/Button";

const CommentButton = () => {
  return (
    <Button>
      <AiOutlineMessage size={20} />
    </Button>
  );
};

export default CommentButton;
