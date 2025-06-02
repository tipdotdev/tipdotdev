"use client";

import { useRef } from "react";

interface FileInputProps {
    accept?: string;
    multiple?: boolean;
    onFileSelect: (files: File[]) => void;
    children: React.ReactNode;
}

export function FileInput({
    accept = "*",
    multiple = false,
    onFileSelect,
    children
}: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            onFileSelect(Array.from(files));
        }
        // Reset input so same file can be selected again
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const triggerFileSelect = () => {
        inputRef.current?.click();
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
            />
            <div onClick={triggerFileSelect}>{children}</div>
        </>
    );
}
