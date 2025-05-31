import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Hr,
    Html,
    Link,
    Preview,
    Row,
    Section,
    Text
} from "@react-email/components";
import { container, footer, footerLink, footerSmall, footerText, main } from "./common-styles";
import { InfoAlert, WarningAlert } from "./components/alert";
import { InfoCallout } from "./components/callout";
import { EmailTerminalFooter } from "./components/footer";
import { EmailHeader } from "./components/header";

interface TipReceivedEmailProps {
    amount: number;
    transactionId: string;
    receivedOn: string;
    platformFee: number;
    tipperEmail: string;
    recieverEmail: string;
    message: string;
}

export const TipReceivedEmail = ({
    amount,
    transactionId,
    receivedOn,
    platformFee,
    tipperEmail,
    recieverEmail,
    message
}: TipReceivedEmailProps) => (
    <Html>
        <Head />
        <Preview>
            You received a{" "}
            {(amount / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            })}
            tip! - tip.dev
        </Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <EmailHeader badgeLabel="INCOMING" title="tip_received" />

                {/* Success Message */}
                <InfoCallout
                    icon="⚡"
                    title="You received a tip!"
                    message={`Someone appreciated your work and sent you ${(
                        amount / 100
                    ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD"
                    })}`}
                />

                {/* Transaction Details */}
                <Section style={contentSection}>
                    <Text style={sectionTitle}>Tip Details</Text>

                    <Section style={detailsGrid}>
                        <Row>
                            <Column style={detailColumn}>
                                <Text style={detailLabel}>Amount Received</Text>
                                <Text style={detailAmount}>
                                    {(amount / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </Text>
                            </Column>
                            <Column style={detailColumn}>
                                <Text style={detailLabel}>Transaction ID</Text>
                                <Text style={detailValue}>{transactionId}</Text>
                            </Column>
                        </Row>
                        <Row>
                            <Column style={detailColumn}>
                                <Text style={detailLabel}>Received On</Text>
                                <Text style={detailValue}>{receivedOn}</Text>
                            </Column>
                            <Column style={detailColumn}>
                                <Text style={detailLabel}>Platform Fee</Text>
                                <Text style={detailValue}>
                                    {(platformFee / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                    (4.5%)
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Tipper Info */}
                    <Section style={tipperSection}>
                        <Text style={tipperTitle}>From</Text>
                        <Row style={tipperRow}>
                            <Column style={avatarColumn}>
                                <Text style={tipperAvatar}></Text>
                            </Column>
                            <Column>
                                <Text style={tipperEmailText}>{tipperEmail}</Text>
                                <Text style={tipperDescription}>Anonymous supporter</Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Message */}
                    <InfoAlert
                        title="Message from your supporter"
                        message={message || "No message"}
                    />

                    {/* Payout Information */}
                    <Section style={payoutSection}>
                        <Text style={payoutTitle}>Payout Information</Text>
                        <Row style={payoutRow}>
                            <Column>
                                <Text style={payoutLabel}>Tip Amount</Text>
                            </Column>
                            <Column style={payoutValueColumn}>
                                <Text style={payoutValue}>
                                    {(amount / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </Text>
                            </Column>
                        </Row>
                        <Row style={payoutRow}>
                            <Column>
                                <Text style={payoutLabel}>Platform Fee (4.5%)</Text>
                            </Column>
                            <Column style={payoutValueColumn}>
                                <Text style={payoutValue}>
                                    -
                                    {(platformFee / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </Text>
                            </Column>
                        </Row>
                        <Row style={payoutRow}>
                            <Column>
                                <Text style={payoutLabel}>Processing Fee</Text>
                            </Column>
                            <Column style={payoutValueColumn}>
                                <Text style={payoutValue}>
                                    -
                                    {(platformFee / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </Text>
                            </Column>
                        </Row>
                        <Hr style={payoutDivider} />
                        <Row style={payoutRow}>
                            <Column>
                                <Text style={payoutTotalLabel}>Your Earnings</Text>
                            </Column>
                            <Column style={payoutValueColumn}>
                                <Text style={payoutTotalValue}>
                                    {(amount / 100 - platformFee / 100).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD"
                                    })}
                                </Text>
                                <Text style={footerSmall}>
                                    Not including any additional Stripe fees
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Action Buttons */}
                    <Section style={buttonSection}>
                        <Button href={`https://tip.dev/dashboard`} style={primaryButton}>
                            View Dashboard
                        </Button>
                        <Button href={`https://tip.dev/t/${transactionId}`} style={secondaryButton}>
                            Thank Your Supporter
                        </Button>
                    </Section>

                    {/* Payout Schedule */}
                    <WarningAlert
                        title="Payout Schedule"
                        message="Your earnings have already been sent to your Stripe account. Timing on Stripe payout varies but is typically within 24 hours."
                    />
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        Questions about this tip?{" "}
                        <Link href="mailto:support@tip.dev" style={footerLink}>
                            Contact Support
                        </Link>
                    </Text>
                    <Text style={footerSmall}>This notification was sent to {recieverEmail}</Text>
                </Section>

                {/* Terminal Footer */}
                <EmailTerminalFooter
                    text={
                        "tip&#8203;.dev --earnings" +
                        `
                        ${(amount / 100 - platformFee / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD"
                        })}`
                    }
                    subtext="keep_creating_awesome_content()"
                />
            </Container>
        </Body>
    </Html>
);

TipReceivedEmail.PreviewProps = {
    amount: 1000,
    transactionId: "1234567890",
    receivedOn: "Jan 1, 2023",
    platformFee: 45,
    tipperEmail: "sender@example.com",
    recieverEmail: "reciever@example.com",
    message:
        "Thanks for the amazing tutorial on React hooks! It really helped me understand the concepts better. Keep up the great work! 🚀"
};

export default TipReceivedEmail;

// Styles
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

const tipperSection = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px"
};

const tipperTitle = {
    color: "#111827",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px 0"
};

const tipperRow = {
    verticalAlign: "top"
};

const avatarColumn = {
    width: "48px",
    paddingRight: "12px"
};

const tipperAvatar = {
    backgroundColor: "#e5e7eb",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    margin: "0",
    textAlign: "center" as const,
    lineHeight: "48px"
};

const tipperEmailText = {
    color: "#111827",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 4px 0"
};

const tipperDescription = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0"
};

const payoutSection = {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px"
};

const payoutTitle = {
    color: "#111827",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px 0"
};

const payoutRow = {
    marginBottom: "12px"
};

const payoutValueColumn = {
    textAlign: "right" as const
};

const payoutLabel = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0"
};

const payoutValue = {
    color: "#111827",
    fontSize: "14px",
    margin: "0"
};

const payoutDivider = {
    borderColor: "#e5e7eb",
    margin: "8px 0"
};

const payoutTotalLabel = {
    color: "#111827",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0"
};

const payoutTotalValue = {
    color: "#111827",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0"
};

const buttonSection = {
    marginBottom: "24px"
};

const primaryButton = {
    backgroundColor: "#000000",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    display: "block",
    textAlign: "center" as const,
    marginBottom: "12px"
};

const secondaryButton = {
    backgroundColor: "transparent",
    color: "#374151",
    fontSize: "16px",
    fontWeight: "600",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    textDecoration: "none",
    display: "block",
    textAlign: "center" as const
};
