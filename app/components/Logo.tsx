import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center py-3">
      <Image
        src="/logo.png"
        alt="Mounjaro de Chía"
        width={130}
        height={86}
        priority
        className="h-auto w-[120px]"
      />
    </div>
  );
}
