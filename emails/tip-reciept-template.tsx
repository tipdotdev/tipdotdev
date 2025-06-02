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
import { container, footer, footerLink, footerSmall, footerText, main } from "./common-styles";
import { InfoAlert } from "./components/alert";
import { SuccessCallout } from "./components/callout";
import { EmailTerminalFooter } from "./components/footer";
import { EmailHeader } from "./components/header";

interface TipReceiptEmailProps {
    senderEmail: string;
    recieverUsername: string;
    recieverAvatar: string;
    recieverBio?: string;
    message?: string;
    amount: number;
    processingFee: number;
    date: string;
    tipId: string;
    paymentMethod: string;
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
    paymentMethod
}: TipReceiptEmailProps) => (
    <Html>
        <Head />
        <Preview>Your tip has been sent successfully - Receipt from tip.dev</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <EmailHeader badgeLabel="RECEIPT" title="payment_successful" />

                {/* Success Message */}
                <SuccessCallout
                    icon="✅"
                    title="Tip sent successfully!"
                    message="Your support means the world to the creator."
                />

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
                                <Text style={detailValue}>
                                    {paymentMethod.length === 4
                                        ? "···· ···· ···· " + paymentMethod
                                        : paymentMethod}
                                </Text>
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
                    <InfoAlert
                        title="Your Message"
                        message={message ? message : "No message provided"}
                    />

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
                <EmailTerminalFooter
                    text="tip&#8203;.dev --version 2.0.1"
                    subtext="thank_you_for_supporting_creators()"
                />
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
    paymentMethod: "Card"
};

export default TipReceiptEmail;

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
