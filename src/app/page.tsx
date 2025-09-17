'use client';

import AppSideBar from "@/components/custom/AppSideBar";
import LibraryCard from "@/components/custom/LibraryCard";

export default function Home() {
    return (
        <div
          className="w-[100%] min-h-screen flex bg-cover bg-center bg-white"
          style={{ backgroundImage: "url('/Background.png')" }}
        >
            <AppSideBar currentRoute="Library"/>
            <LibraryCard />
            <LibraryCard />
            <LibraryCard />
            <LibraryCard />
        </div>
    );
}
