export function TUIBadge({ text }: { text: string }) {
    const getBadgeContent = () => {
        // Define extra padding (total extra spaces to add)
        const extraPadding = 4;
        // Total width is the text length plus our extra padding.
        const totalWidth = text.length + extraPadding;
        // Create the top and bottom borders.
        const top = "+" + "-".repeat(totalWidth) + "+";
        const bottom = top;

        // Calculate space needed to center the text.
        const totalPaddingSpaces = totalWidth - text.length;
        const leftPadding = Math.floor(totalPaddingSpaces / 2);
        const rightPadding = totalPaddingSpaces - leftPadding;
        const paddedText = " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
        // Surround the padded text with vertical bars.
        const middle = "|" + paddedText + "|";

        return (
            <div className="flex flex-col items-center whitespace-pre font-mono text-xs text-[#fff]">
                {top}
                <br />
                {middle}
                <br />
                {bottom}
            </div>
        );
    };

    return <div className="flex items-center">{getBadgeContent()}</div>;
}
