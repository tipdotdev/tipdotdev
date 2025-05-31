import {
    Body,
    Column,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text
} from "@react-email/components";

interface TipReceiptEmailProps {
    senderEmail: string;
    recieverUsername: string;
    recieverAvatar: string;
    recieverBio: string;
    message?: string;
    amount: number;
    processingFee: number;
    date: string;
    tipId: string;
    cardLast4: string;
}

export const TipReceiptEmail = ({
    senderEmail,
    recieverUsername,
    recieverAvatar,
    recieverBio,
    message,
    amount,
    processingFee,
    date,
    tipId,
    cardLast4
}: TipReceiptEmailProps) => (
    <Html>
        <Head />
        <Preview>Your tip has been sent successfully - Receipt from tip.dev</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <Section style={header}>
                    <Row>
                        <Column>
                            <Text style={headerTitle}>{"{$}"} tip&#8203;.dev</Text>
                            <Text style={headerSubtitle}>{"> payment_successful"}</Text>
                        </Column>
                        <Column style={headerRight}>
                            <Text style={receiptBadge}>RECEIPT</Text>
                        </Column>
                    </Row>
                </Section>

                {/* Success Message */}
                <Section style={successSection}>
                    <Text style={successTitle}>✅ Tip sent successfully!</Text>
                    <Text style={successMessage}>Your support means the world to the creator.</Text>
                </Section>

                {/* Transaction Details */}
                <Section style={contentSection}>
                    <Text style={sectionTitle}>Transaction Details</Text>

                    <Section style={detailsGrid}>
                        <Row>
                            <Column style={detailColumn}>
                                <Text style={detailLabel}>Amount</Text>
                                <Text style={detailAmount}>
                                    {(amount / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </Text>
                            </Column>
                            <Column style={detailColumn}>
                                <Text style={detailLabel}>Transaction ID</Text>
                                <Text style={detailValue}>{tipId}</Text>
                            </Column>
                        </Row>
                        <Row>
                            <Column style={detailColumn}>
                                <Text style={detailLabel}>Date</Text>
                                <Text style={detailValue}>{date}</Text>
                            </Column>
                            <Column style={detailColumn}>
                                <Text style={detailLabel}>Payment Method</Text>
                                <Text style={detailValue}>•••• •••• •••• {cardLast4}</Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Recipient Info */}
                    <Section style={recipientSection}>
                        <Text style={recipientTitle}>Tip Recipient</Text>
                        <Row style={recipientRow}>
                            <Column style={avatarColumn}>
                                <Img style={avatar} src={recieverAvatar} alt={recieverUsername} />
                            </Column>
                            <Column>
                                <Text style={recipientName}>@{recieverUsername}</Text>
                                <Text style={recipientBio}>{recieverBio || "Tip.dev member"}</Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Message */}
                    <Section style={messageSection}>
                        <Text style={messageTitle}>Your Message</Text>
                        <Text style={messageText}>{message ? message : "No message provided"}</Text>
                    </Section>

                    {/* Summary */}
                    <Section style={summarySection}>
                        <Hr style={summaryDivider} />
                        <Row style={summaryRow}>
                            <Column>
                                <Text style={summaryLabel}>Tip Amount</Text>
                            </Column>
                            <Column style={summaryValueColumn}>
                                <Text style={summaryValue}>
                                    {(amount / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </Text>
                            </Column>
                        </Row>
                        <Row style={summaryRow}>
                            <Column>
                                <Text style={summaryLabel}>Processing Fee</Text>
                            </Column>
                            <Column style={summaryValueColumn}>
                                <Text style={summaryValue}>
                                    {(processingFee / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </Text>
                            </Column>
                        </Row>
                        <Hr style={summaryDivider} />
                        <Row style={summaryRow}>
                            <Column>
                                <Text style={summaryTotalLabel}>Total Charged</Text>
                            </Column>
                            <Column style={summaryValueColumn}>
                                <Text style={summaryTotalValue}>
                                    {(amount / 100 + processingFee / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </Text>
                            </Column>
                        </Row>
                    </Section>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        Questions about this transaction?{" "}
                        <Link href="mailto:support@tip.dev" style={footerLink}>
                            Contact Support
                        </Link>
                    </Text>
                    <Text style={footerSmall}>This receipt was sent to {senderEmail}</Text>
                </Section>

                {/* Terminal Footer */}
                <Section style={terminalFooter}>
                    <Text style={terminalText}>{">"} tip&#8203;.dev --version 2.0.1</Text>
                    <Text style={terminalSubtext}>{"> thank_you_for_supporting_creators()"}</Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

TipReceiptEmail.PreviewProps = {
    senderEmail: "sender@example.com",
    recieverUsername: "kyle",
    recieverAvatar: "https://avatars.githubusercontent.com/u/41174949?v=4",
    recieverBio: "Full-stack developer building awesome tools",
    message:
        "Thanks for the amazing tutorial on React hooks! It really helped me understand the concepts better. Keep up the great work! 🚀",
    amount: 1000,
    processingFee: 450,
    date: "Jan 1, 2023",
    tipId: "12",
    cardLast4: "7461"
};

export default TipReceiptEmail;

const main = {
    backgroundColor: "#f9fafb",
    fontFamily: "system-ui, sans-serif"
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    maxWidth: "600px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
};

const header = {
    backgroundColor: "#121212",
    padding: "24px"
};

const headerTitle = {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    fontFamily: "monospace",
    margin: "0 0 4px 0"
};

const headerSubtitle = {
    color: "#A0A1A9",
    fontSize: "14px",
    fontFamily: "monospace",
    margin: "0"
};

const headerRight = {
    textAlign: "right" as const
};

const receiptBadge = {
    backgroundColor: "#fff",
    color: "#121212",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "monospace",
    display: "inline-block",
    margin: "0"
};

const successSection = {
    backgroundColor: "#f0fdf4",
    borderLeft: "4px solid #10b981",
    padding: "16px"
};

const successTitle = {
    color: "#166534",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 4px 0"
};

const successMessage = {
    color: "#15803d",
    fontSize: "14px",
    margin: "0"
};

const contentSection = {
    padding: "24px"
};

const sectionTitle = {
    color: "#111827",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 16px 0"
};

const detailsGrid = {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px"
};

const detailColumn = {
    width: "50%",
    paddingBottom: "16px"
};

const detailLabel = {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0 0 4px 0"
};

const detailAmount = {
    color: "#111827",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0"
};

const detailValue = {
    color: "#111827",
    fontSize: "14px",
    fontFamily: "monospace",
    margin: "0"
};

const recipientSection = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px"
};

const recipientTitle = {
    color: "#111827",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px 0"
};

const recipientRow = {
    verticalAlign: "top"
};

const avatarColumn = {
    width: "48px",
    paddingRight: "12px"
};

const avatar = {
    backgroundColor: "#111827",
    color: "#10b981",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: "18px",
    margin: "0",
    textAlign: "center" as const,
    lineHeight: "48px"
};

const recipientName = {
    color: "#111827",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 4px 0"
};

const recipientBio = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0"
};

const messageSection = {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px"
};

const messageTitle = {
    color: "#1e3a8a",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 8px 0"
};

const messageText = {
    color: "#1e40af",
    fontSize: "14px",
    fontStyle: "italic",
    margin: "0"
};

const summarySection = {
    paddingTop: "16px"
};

const summaryDivider = {
    borderColor: "#e5e7eb",
    margin: "8px 0"
};

const summaryRow = {
    marginBottom: "8px"
};

const summaryValueColumn = {
    textAlign: "right" as const
};

const summaryLabel = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0"
};

const summaryValue = {
    color: "#111827",
    fontSize: "14px",
    margin: "0"
};

const summaryTotalLabel = {
    color: "#111827",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0"
};

const summaryTotalValue = {
    color: "#111827",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0"
};

const footer = {
    backgroundColor: "#f9fafb",
    padding: "16px 24px",
    textAlign: "center" as const
};

const footerText = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 8px 0"
};

const footerLink = {
    color: "#2563eb",
    textDecoration: "none"
};

const footerSmall = {
    color: "#9ca3af",
    fontSize: "12px",
    margin: "0"
};

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
