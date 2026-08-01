import { BookOpen, Coffee } from "lucide-react";

export function LibraryDesk() {
  return <div className="absolute bottom-[10%] left-1/2 hidden w-[300px] -translate-x-1/2 md:block"><div className="relative h-4 rounded-[50%] bg-[#6b4931] shadow-[0_15px_20px_rgb(0_0_0/.35)]"><div className="absolute -top-3 left-8 h-4 w-20 rounded-full bg-[#7c5638] shadow-inner" /><div className="absolute -top-8 left-12 h-7 w-8 rounded-t-full border-2 border-brass/60 bg-[#25211b]" /><Coffee className="absolute -top-7 right-14 text-brass/70" size={23} /><BookOpen className="absolute -top-5 left-1/2 text-parchment/70" size={21} /></div><div className="mx-auto h-20 w-[250px] border-x-8 border-[#4f3425] bg-[#5e3e29]/80" /></div>;
}
