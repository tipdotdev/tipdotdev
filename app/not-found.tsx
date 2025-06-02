import TUINavbar from "@/components/tui/tui-navbar";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col font-mono font-normal">
            <TUINavbar active={undefined} />
            <section className="relative flex h-screen flex-col items-center justify-center px-12 py-8">
                <div className="flex max-w-md flex-col gap-2">
                    <h2 className="text-xl text-[#fff]">404 - Page Not Found</h2>
                    <p className="mt-4">
                        The page you are looking for does not exist. Please check the URL and try
                        again.
                    </p>
                </div>
            </section>
        </div>
    );
}
