import ModalBgOverlay from "@/components/ModalBgOverlay";
import Modal from "@/components/Modal";
const ArticleModal = ({ params }) => {
  return (
    <Modal>
    
      <ModalBgOverlay parameters={params} />
    </Modal>
   
  );
};

export default ArticleModal;
