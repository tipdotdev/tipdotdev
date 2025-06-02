export default function SectionHeading({
    text,
    description
}: {
    text: string;
    description?: string;
}) {
    return (
        <div className="mb-16 text-center font-mono">
            <h2 className="mb-4 text-2xl font-bold md:text-4xl">
                <span className="text-foreground/60">{">"}</span> {text}
            </h2>
            <p className="text-lg text-foreground/60">{description}</p>
        </div>
    );
}
