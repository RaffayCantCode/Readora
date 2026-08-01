import { LibraryWorkspace } from "@/components/library/library-workspace";
import { TrendingThisYear } from "./trending-this-year";

export function ReadoraHome() {
  return (
    <>
      <TrendingThisYear />
      <section id="my-library">
        <LibraryWorkspace showBack={false} />
      </section>
    </>
  );
}
