import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div
      className={"grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"}
    >
      <button className="bg-white rounded text-black px-6 cursor-pointer"
       onClick={()=> router.push('/dashboard')}>
        Open</button>
    </div> );
}
