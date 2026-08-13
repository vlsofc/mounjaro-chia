import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center py-3">
      <Image
        src="/logo.png"
        alt="Gelatina de Chía"
        width={160}
        height={70}
        priority
        className="h-auto w-[160px]"
      />
    </div>
  );
}
