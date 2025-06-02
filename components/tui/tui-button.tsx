"use client";

import type React from "react";
import { useState } from "react";

interface TUIButtonProps {
    text: string;
    onClick?: () => void;
}

export const TUIButton: React.FC<TUIButtonProps> = ({ text, onClick }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const buttonStyle = {
        fontFamily: "monospace",
        fontSize: "16px",
        lineHeight: "1",
        cursor: "pointer",
        userSelect: "none" as const,
        transition: "all 0.1s ease"
    };

    const getButtonContent = () => {
        const width = text.length + 4;
        const top = "╭" + "─".repeat(width) + "╮";
        const middle = isPressed ? `${text}` : `${text}`;
        const bottom = "╰" + "─".repeat(width) + "╯";

        return (
            <>
                {top}
                <br />
                {middle}
                <br />
                {bottom}
            </>
        );
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`${isPressed ? "translate-y-0.5" : ""}`}
            role="button"
            tabIndex={0}
        >
            {getButtonContent()}
        </button>
    );
};
