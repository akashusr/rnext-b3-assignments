import SubscribeIcon from "@/components/icons/SubscribeIcon"
const SubscribeButton = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
       <SubscribeIcon/>
        
      </div>
      <span className="text-sm font-medium">5,810</span>
    </div>
  );
};

export default SubscribeButton