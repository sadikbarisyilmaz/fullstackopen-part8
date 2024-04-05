import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex w-full justify-center items-center mt-10">
      <Loader2 className="animate-spin" />
    </div>
  );
};
