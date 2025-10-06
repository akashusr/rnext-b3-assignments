import { getImg } from "../../utils/getImg";
import Button from "../UI/Button";
import Icon from "../UI/Icon";

export default function Product({
  slug,
  name,
  price,
  isProductExist,
  onAdd,
  onRemove,
}) {
  return (
    <div className="bg-opacity-30 hover:bg-opacity-40 mb-3 flex items-center justify-between rounded-md bg-gray-700 p-3 transition-all duration-300">
      <div className="flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center">
          <img src={getImg(slug)} alt={name} className="h-10 w-10" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-xs text-gray-400">BDT {price}</p>
        </div>
      </div>

      {isProductExist ? (
        <Button variant="icon" onClick={onRemove}>
          <Icon name="decrease" className="h-5 w-5 text-red-500" />
        </Button>
      ) : (
        <Button variant="icon" onClick={onAdd}>
          <Icon name="increase" className="h-5 w-5 text-green-500" />
        </Button>
      )}
    </div>
  );
}
