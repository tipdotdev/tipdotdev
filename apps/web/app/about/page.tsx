import TUINavbar from "@/components/tui/tui-navbar";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col font-mono font-normal">
            <TUINavbar active="about" />
        </div>
    );
}
