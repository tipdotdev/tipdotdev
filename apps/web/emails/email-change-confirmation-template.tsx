import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Html,
    Link,
    Preview,
    Row,
    Section,
    Text
} from "@react-email/components";
import { container, footer, footerSmall, footerText, main, securityLink } from "./common-styles";
import { WarningAlert } from "./components/alert";
import { ErrorCallout } from "./components/callout";
import { EmailTerminalFooter } from "./components/footer";
import { EmailHeader } from "./components/header";

interface EmailChangeConfirmationProps {
    oldEmail: string;
    newEmail: string;
    url: string;
    token: string;
    requestedAt: Date;
}

export default function EmailChangeConfirmation({
    oldEmail,
    newEmail,
    url,
    token,
    requestedAt
}: EmailChangeConfirmationProps) {
    return (
        <Html>
            <Head />
            <Preview>
                Confirm your email change from old.email@example.com to new.email@example.com -
                tip.dev Security
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <EmailHeader
                        badgeLabel="SECURITY"
                        title="Email Change Request"
                        badgeType="security"
                    />

                    <ErrorCallout
                        icon="⚠️"
                        title="Email Change Request"
                        message="Confirm this change only if you requested it."
                    />

                    {/* Main Content */}
                    <Section style={contentSection}>
                        <Text style={mainTitle}>Confirm Email Change</Text>
                        <Text style={mainText}>
                            You requested to change your email address from{" "}
                            <strong>{oldEmail}</strong> to <strong>{newEmail}</strong>. Click the
                            button below to confirm this change.
                        </Text>

                        {/* Critical Security Warning */}
                        <WarningAlert
                            title="Time Sensitive"
                            message="This email change link and verification code will expire in 5 minutes for security. If you don't confirm within this time, you'll need to request a new email change."
                        />

                        {/* Confirmation Button */}
                        <Section style={buttonSection}>
                            <Button href={url} style={confirmButton}>
                                Confirm Email Change
                            </Button>
                            <Text style={buttonSubtext}>
                                This action will take effect immediately
                            </Text>
                        </Section>

                        {/* Manual Token Section */}
                        <Section style={manualSection}>
                            <Text style={manualTitle}>Manual Confirmation</Text>
                            <Text style={manualText}>
                                If the button above doesn&apos;t work, you can manually enter this
                                verification code:
                            </Text>

                            {/* Token Display */}
                            <Section style={tokenContainer}>
                                <Row>
                                    <Column>
                                        <Text style={tokenLabel}>{"> email_change_token:"}</Text>
                                        <Text style={tokenValue}>{token}</Text>
                                    </Column>
                                </Row>
                            </Section>
                        </Section>

                        {/* Enhanced Security Warnings */}
                        <Section style={warningsContainer}>
                            <Section style={securityReminderSection}>
                                <Row style={securityReminderRow}>
                                    <Column style={iconColumn}>
                                        <Text style={shieldIcon}>🛡️</Text>
                                    </Column>
                                    <Column>
                                        <Text style={securityReminderTitle}>Security Reminder</Text>
                                        <Text style={securityReminderText}>
                                            <strong>
                                                Never share this email or verification code
                                            </strong>{" "}
                                            with anyone. tip.dev staff will never ask for this
                                            information. If you suspect unauthorized access, change
                                            your password immediately.
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>
                        </Section>

                        {/* Request Details */}
                        <Section style={detailsSection}>
                            <Text style={detailsTitle}>Request Details</Text>
                            <Text style={detailItem}>
                                <strong>Current Email:</strong> {oldEmail}
                            </Text>
                            <Text style={detailItem}>
                                <strong>New Email:</strong> {newEmail}
                            </Text>
                            <Text style={detailItem}>
                                <strong>Requested:</strong> {requestedAt.toLocaleString()}
                            </Text>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            <strong>Didn&apos;t request this email change?</strong>{" "}
                            <Link href="mailto:security@tip.dev" style={securityLink}>
                                Report unauthorized access immediately
                            </Link>
                        </Text>
                        <Text style={footerSmall}>
                            This security email was sent to {newEmail} from tip.dev
                        </Text>
                    </Section>

                    <EmailTerminalFooter
                        text="tip&#8203;.dev --security --email-change"
                        subtext="verify_identity_required()"
                    />
                </Container>
            </Body>
        </Html>
    );
}

EmailChangeConfirmation.PreviewProps = {
    oldEmail: "old.email@example.com",
    newEmail: "new.email@example.com",
    url: "https://tip.dev/auth/verify?token=ABC-DEF-123-456",
    token: "ABC-DEF-123-456",
    requestedAt: new Date("2025-05-30T16:45:00Z")
};

// Styles
const iconColumn = {
    width: "32px",
    paddingRight: "12px"
};

const contentSection = {
    padding: "24px"
};

const mainTitle = {
    color: "#111827",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 8px 0"
};

const mainText = {
    color: "#6b7280",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "0 0 24px 0"
};

const buttonSection = {
    textAlign: "center" as const,
    marginBottom: "32px"
};

const confirmButton = {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "600",
    padding: "16px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    display: "inline-block",
    margin: "0 0 8px 0"
};

const buttonSubtext = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0"
};

const manualSection = {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px"
};

const manualTitle = {
    color: "#111827",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 12px 0"
};

const manualText = {
    color: "#6b7280",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "0 0 16px 0"
};

const tokenContainer = {
    backgroundColor: "#000000",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px"
};

const tokenLabel = {
    color: "#9ca3af",
    fontSize: "14px",
    fontFamily: "monospace",
    margin: "0 0 4px 0"
};

const tokenValue = {
    color: "#ffffff",
    fontSize: "20px",
    fontFamily: "monospace",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    margin: "0"
};

const warningsContainer = {
    marginBottom: "24px"
};

const securityReminderSection = {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "16px"
};

const securityReminderRow = {
    verticalAlign: "top"
};

const shieldIcon = {
    fontSize: "20px",
    margin: "0"
};

const securityReminderTitle = {
    color: "#991b1b",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 4px 0"
};

const securityReminderText = {
    color: "#b91c1c",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "0"
};

const detailsSection = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "24px"
};

const detailsTitle = {
    color: "#111827",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 8px 0"
};

const detailItem = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 4px 0"
};
