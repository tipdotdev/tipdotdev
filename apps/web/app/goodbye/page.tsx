export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center font-mono font-normal">
            <section className="relative mt-12 flex w-full max-w-4xl flex-col items-center justify-center px-4 py-8">
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-xl text-[#fff]">Your account has been deleted.</h1>
                    <p className="mt-2 text-sm">
                        We&apos;re sorry to see you go. If you have any feedback or questions,
                        please contact us at{" "}
                        <a href="mailto:support@tip.dev" className="text-blue-500">
                            support@tip.dev
                        </a>
                        .
                    </p>
                </div>
            </section>
        </div>
    );
}
