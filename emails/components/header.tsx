import { Column, Row, Section, Text } from "@react-email/components";

interface EmailHeaderProps {
    badgeLabel: string;
    title: string;
    badgeType?: "security" | "info";
}

export const EmailHeader = ({ badgeLabel, title, badgeType }: EmailHeaderProps) => (
    <Section style={header}>
        <Row>
            <Column>
                <Text style={headerTitle}>{"{$}"} tip&#8203;.dev</Text>
                <Text style={headerSubtitle}>
                    {">"} {title}
                </Text>
            </Column>
            <Column style={headerRight}>
                <Text style={badgeType === "security" ? securityBadge : badgeText}>
                    {badgeLabel}
                </Text>
            </Column>
        </Row>
    </Section>
);

const header = {
    backgroundColor: "#000000",
    padding: "24px"
};

const headerTitle = {
    color: "#ffffff !important",
    fontSize: "24px",
    fontWeight: "bold",
    fontFamily: "monospace",
    margin: "0 0 4px 0",
    textDecoration: "none !important"
};

const headerSubtitle = {
    color: "#d1d5db",
    fontSize: "14px",
    fontFamily: "monospace",
    margin: "0"
};

const headerRight = {
    textAlign: "right" as const
};

const badgeText = {
    backgroundColor: "#ffffff",
    color: "#000000",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "monospace",
    display: "inline-block",
    margin: "0"
};

const securityBadge = {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "monospace",
    display: "inline-block",
    margin: "0"
};
