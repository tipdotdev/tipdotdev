import { Section, Text } from "@react-email/components";

interface EmailTerminalFooterProps {
    text: string;
    subtext: string;
}

export const EmailTerminalFooter = ({ text, subtext }: EmailTerminalFooterProps) => (
    <Section style={terminalFooter}>
        <Text style={terminalText}>
            {">"} {text}
        </Text>
        <Text style={terminalSubtext}>
            {">"} {subtext}
        </Text>
    </Section>
);

const terminalFooter = {
    backgroundColor: "#121212",
    padding: "16px",
    textAlign: "center" as const
};

const terminalText = {
    color: "#fff",
    fontSize: "14px",
    fontFamily: "monospace",
    margin: "0 0 4px 0"
};

const terminalSubtext = {
    color: "#A0A1A9",
    fontSize: "14px",
    fontFamily: "monospace",
    margin: "0"
};
