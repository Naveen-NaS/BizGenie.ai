import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <Image src="/logo.png" alt="Vercel Logo" width={72} height={16} />
      </div>
    </>
  );
}
