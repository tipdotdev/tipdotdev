import SectionHeading from "./section-heading";

export default function HowItWorks() {
    return (
        <section className="py-20">
            <div className="mx-auto max-w-6xl px-4">
                <SectionHeading text="how_it_works()" />
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
                            <span className="text-2xl font-bold">1</span>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Create Your Profile</h3>
                        <p className="text-foreground/60">
                            Sign up and customize your tip page in minutes
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
                            <span className="text-2xl font-bold">2</span>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Share Your Link</h3>
                        <p className="text-foreground/60">
                            Add your tip.dev link to GitHub, Twitter, blog posts, anywhere
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
                            <span className="text-2xl font-bold">3</span>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Get Paid</h3>
                        <p className="text-foreground/60">
                            Receive tips instantly and withdraw to your bank account
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
