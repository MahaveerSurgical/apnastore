import { Plus } from "lucide-react";

type Props = {
  onClick: () => void;
};

export default function FloatingActionButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed 
      bottom-20 md:bottom-6 right-6 
      bg-primary-600 hover:bg-primary-700 
      text-grey 
      rounded-full 
      p-4 
      shadow-lg 
      transition
      z-50"
      aria-label="Add new"
    >
      <Plus size={28} />
    </button>
  );
}