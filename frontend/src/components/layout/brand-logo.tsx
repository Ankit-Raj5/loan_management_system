import Image from "next/image";
import { cn } from "@/lib/cn";
import { BRAND } from "@/lib/config";

// The LMS symbol on a white tile followed by the brand name (sidebar and mobile header); `light` is for dark/orange backgrounds
export function BrandLogo({ light }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className={cn("grid size-10 place-items-center rounded-xl bg-white", !light && "shadow-card ring-1 ring-line")}>
        <Image src={BRAND.mark.url} alt="" width={BRAND.mark.width} height={BRAND.mark.height} unoptimized priority className="h-auto w-7" />
      </span>
      <span className={cn("text-xl font-extrabold", light ? "text-white" : "text-ink")}>{BRAND.name}</span>
    </span>
  );
}
