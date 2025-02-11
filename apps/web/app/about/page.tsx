import TUINavbar from "@/components/tui/tui-navbar";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col bg-[#111] font-mono font-normal text-[#d7d7d7]">
            <TUINavbar active="about" />
        </div>
    );
}
