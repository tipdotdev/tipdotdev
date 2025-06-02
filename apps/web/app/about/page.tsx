import Footer from "@/components/footer";
import TUINavbar from "@/components/tui/tui-navbar";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center font-mono font-normal">
            <TUINavbar active="about" />
            <section className="relative mb-12 mt-12 flex w-full max-w-4xl flex-col items-center justify-center px-4 py-8">
                <div className="flex w-full flex-col gap-12">
                    <div className="flex w-full flex-col gap-2">
                        <h1 className="text-xl text-[#fff]">What is tip.dev?</h1>
                        <p className="mt-2 text-sm">
                            tip.dev is a platform built exclusively for developers, designed to
                            empower creators in the tech community by enabling them to receive
                            financial support directly from their users and fans. Whether
                            you&apos;re an open-source contributor, an indie app developer, or a
                            creator building tools for others, tip.dev provides a seamless way to
                            connect with your supporters and be rewarded for your work.
                        </p>
                    </div>

                    <div className="h-0 w-full border-t border-dashed border-[#AAA]/40" />

                    <div className="flex w-full flex-col gap-2">
                        <h1 className="text-xl text-[#fff]">What we do</h1>
                        <p className="mt-2 text-sm">
                            At its core, tip.dev functions like platforms such as Ko-fi, Buy Me a
                            Coffee, or Patreon—but with a focus on developers. Here&apos;s how it
                            works:
                        </p>
                        <List
                            items={[
                                {
                                    topic: "Create Your Page",
                                    text: "Developers sign up and customize their tip.dev page to reflect their brand. Add a profile picture, bio, banner, and links to your projects or social media."
                                },
                                {
                                    topic: "Share Your Page",
                                    text: "Once your page is live (e.g., https://tip.dev/<your-username>), you can share it anywhere—on your website, app, GitHub profile, social media, etc."
                                },
                                {
                                    topic: "Receive Tips",
                                    text: "Fans of your work can visit your page and leave tips as a token of appreciation. Whether they're users of your app or beneficiaries of your open-source contributions, supporters can show their gratitude with just a few clicks."
                                }
                            ]}
                        />
                        <p className="text-sm">
                            tip.dev is all about simplicity. There are no platform subscriptions or
                            complex setups—just an easy way for developers to monetize their passion
                            projects.
                        </p>
                    </div>

                    <div className="h-0 w-full border-t border-dashed border-[#AAA]/40" />

                    <div className="flex w-full flex-col gap-2">
                        <h1 className="text-xl text-[#fff]">Why tip.dev?</h1>
                        <p className="mt-2 text-sm">
                            We believe developers deserve recognition and support for the value they
                            create. Here&apos;s what sets Tip.dev apart:
                        </p>
                        <List
                            items={[
                                {
                                    topic: "Tailored for Developers",
                                    text: "Unlike other platforms, tip.dev is built specifically with developers in mind. We understand the unique needs of devs and their communities."
                                },
                                {
                                    topic: "No Barriers to Entry",
                                    text: "Signing up is quick and free. You can start earning tips immediately after completing our simple onboarding process."
                                },
                                {
                                    topic: "Transparent Fees",
                                    text: "We take a 4.5% fee on each transaction to cover development costs. There are no hidden fees or gimmicks—just a straightforward way to support the platform."
                                }
                            ]}
                        />
                        <p className="text-sm">
                            If you&apos;ve ever created something that others use and love, tip.dev
                            is for you.
                        </p>
                    </div>

                    <div className="h-0 w-full border-t border-dashed border-[#AAA]/40" />

                    <div className="flex w-full flex-col gap-2">
                        <h1 className="text-xl text-[#fff]">Who is it for?</h1>
                        <p className="mt-2 text-sm">
                            tip.dev is perfect for any developer who wants to connect with their
                            supporters:
                        </p>
                        <List
                            items={[
                                {
                                    text: "Open-source contributors seeking a way to fund their projects."
                                },
                                {
                                    text: "Indie app developers looking to monetize their creations."
                                },
                                {
                                    text: "Toolmakers whose work benefits the broader dev community."
                                }
                            ]}
                        />
                        <p className="text-sm">
                            If you&apos;ve ever created something that others use and love, tip.dev
                            is for you.
                        </p>
                    </div>

                    <div className="h-0 w-full border-t border-dashed border-[#AAA]/40" />

                    <div className="flex w-full flex-col gap-2">
                        <h1 className="text-xl text-[#fff]">Our mission</h1>
                        <p className="mt-2 text-sm">
                            We aim to create a world where developers can focus on what they do
                            best—building amazing things—without worrying about monetization
                            barriers. tip.dev is more than just a platform; it&apos;s a movement to
                            support the creators driving innovation in tech. <br />
                            <br />
                            So whether you&apos;re just starting out or already have an established
                            audience, we&apos;re here to help you turn appreciation into tangible
                            support.
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

function List({ items }: { items: { topic?: string; text: string }[] }) {
    return (
        <ul className="ml-8 flex list-outside list-disc flex-col gap-2 text-sm">
            {items.map((item, index) => (
                <ListItem key={index} {...item} />
            ))}
        </ul>
    );
}

function ListItem({ topic, text }: { topic?: string; text: string }) {
    return (
        <li>
            {topic && (
                <>
                    <span className="text-bold underline decoration-foreground/40 underline-offset-4">
                        {topic}:
                    </span>{" "}
                </>
            )}
            {text}
        </li>
    );
}
