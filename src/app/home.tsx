"use client";

import { useRouter } from "next/navigation";


export const Home = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/dashboard"); // Navigates to the dashboard
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#15B392] to-[#D2FF72] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Chat
            <p className="inline font-extrabold text-[hsl(163,100,50)]">i</p>
            zen
          </h1>
          <button
            onClick={handleNavigation}
            className="rounded-xl bg-[#15B392] p-4 text-xl font-extrabold hover:bg-[#12A482]"
          >
            Jump to chat
          </button>
        </div>
      </main>
    </>
  );
};
