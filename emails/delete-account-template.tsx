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
import { container, footer, footerSmall, footerText, main } from "./common-styles";
import { WarningAlert } from "./components/alert";
import { ErrorCallout } from "./components/callout";
import { EmailTerminalFooter } from "./components/footer";
import { EmailHeader } from "./components/header";

interface AccountDeletionProps {
    email: string;
    userName?: string;
    url: string;
    token: string;
    requestedAt: Date;
}

export default function DeleteAccountTemplate({
    email,
    userName,
    url,
    token,
    requestedAt
}: AccountDeletionProps) {
    return (
        <Html>
            <Head />
            <Preview>Confirm account deletion for {email} - This action cannot be undone</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <EmailHeader
                        badgeLabel="DELETION"
                        title="Account Deletion"
                        badgeType="security"
                    />

                    <ErrorCallout
                        icon="🗑️"
                        title="Account Deletion Request"
                        message="This action is permanent and cannot be undone."
                    />

                    {/* Main Content */}
                    <Section style={contentSection}>
                        <Text style={mainTitle}>
                            {userName
                                ? `${userName}, we're sorry to see you go`
                                : "Account Deletion Confirmation"}
                        </Text>
                        <Text style={mainText}>
                            You requested to permanently delete your tip.dev account for{" "}
                            <strong>{email}</strong>. Before proceeding, please review what will
                            happen when you delete your account.
                        </Text>

                        {/* What Gets Deleted Section */}
                        <Section style={deletionDetailsSection}>
                            <Text style={deletionTitle}>What will be permanently deleted:</Text>
                            <Text style={deletionItem}>
                                🗂️ Your entire profile and creator page
                            </Text>
                            <Text style={deletionItem}>💰 All earnings history</Text>
                            <Text style={deletionItem}>📊 Dashboard data and analytics</Text>
                            <Text style={deletionItem}>
                                💌 All received messages from supporters
                            </Text>
                            <Text style={deletionItem}>
                                🔗 Your custom tip.dev link will become unavailable
                            </Text>
                            <Text style={deletionItem}>⚙️ Account settings and preferences</Text>
                        </Section>

                        {/* Critical Warning */}
                        <WarningAlert
                            title="This action is irreversible"
                            message="Once deleted, your account cannot be recovered. You'll need to create a completely new account if you want to use tip.dev again in the future."
                        />

                        {/* Deletion Button */}
                        <Section style={buttonSection}>
                            <Button href={url} style={deleteButton}>
                                Yes, Delete My Account Forever
                            </Button>
                            <Text style={buttonSubtext}>
                                This will immediately and permanently delete your account
                            </Text>
                        </Section>

                        {/* Alternative Options */}
                        <Section style={alternativeSection}>
                            <Text style={alternativeTitle}>
                                Not sure? Consider these alternatives:
                            </Text>
                            <Text style={alternativeItem}>
                                📴 <strong>Deactivate temporarily:</strong> Hide your profile
                                without losing data
                            </Text>
                            <Text style={alternativeItem}>
                                🔕 <strong>Turn off notifications:</strong> Stop emails while
                                keeping your account
                            </Text>
                            <Text style={alternativeItem}>
                                💬 <strong>Contact support:</strong> Let us help resolve any issues
                            </Text>
                            <Text style={alternativeText}>
                                <Link href="mailto:support@tip.dev" style={supportLink}>
                                    Contact our support team
                                </Link>{" "}
                                if you&apos;d like to explore these options.
                            </Text>
                        </Section>

                        {/* Manual Token Section */}
                        <Section style={manualSection}>
                            <Text style={manualTitle}>Manual Deletion</Text>
                            <Text style={manualText}>
                                If the button above doesn&apos;t work, you can confirm deletion by
                                entering this code:
                            </Text>

                            {/* Token Display */}
                            <Section style={tokenContainer}>
                                <Row>
                                    <Column>
                                        <Text style={tokenLabel}>{"> deletion_token:"}</Text>
                                        <Text style={tokenValue}>{token}</Text>
                                    </Column>
                                </Row>
                            </Section>

                            <Text style={instructionsText}>
                                Go to{" "}
                                <Link
                                    href="https://tip.dev/account/delete/confirm"
                                    style={instructionLink}
                                >
                                    tip.dev/account/delete/confirm
                                </Link>{" "}
                                and enter the code above.
                            </Text>
                        </Section>

                        {/* Time Limit */}
                        <WarningAlert
                            title="⏰ Time limit"
                            message="This deletion link will expire in 1 hour for security. If it expires, you'll need to request account deletion again from your settings."
                        />

                        {/* Request Details */}
                        <Section style={detailsSection}>
                            <Text style={detailsTitle}>Deletion Request Details</Text>
                            <Text style={detailItem}>
                                <strong>Account:</strong> {email}
                            </Text>
                            <Text style={detailItem}>
                                <strong>Requested:</strong> {requestedAt.toLocaleString()}
                            </Text>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            <strong>Didn&apos;t request this deletion?</strong>{" "}
                            <Link href="mailto:security@tip.dev" style={securityLink}>
                                Contact security immediately
                            </Link>
                        </Text>
                        <Text style={footerSmall}>
                            This deletion request was sent to {email} from tip.dev
                        </Text>
                    </Section>

                    <EmailTerminalFooter
                        text="tip&#8203;.dev --account --delete"
                        subtext="farewell_creator()"
                    />
                </Container>
            </Body>
        </Html>
    );
}

DeleteAccountTemplate.PreviewProps = {
    email: "creator@example.com",
    userName: "Alex",
    url: "https://tip.dev/account/delete/confirm?token=DEL-123-456-789",
    token: "DEL-123-456-789",
    requestedAt: new Date("2025-05-30T20:15:00Z")
};

// Styles
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

const deletionDetailsSection = {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "24px"
};

const deletionTitle = {
    color: "#991b1b",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px 0"
};

const deletionItem = {
    color: "#b91c1c",
    fontSize: "14px",
    margin: "0 0 8px 0",
    lineHeight: "1.4"
};

const buttonSection = {
    textAlign: "center" as const,
    marginBottom: "32px"
};

const deleteButton = {
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

const alternativeSection = {
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "24px"
};

const alternativeTitle = {
    color: "#0c4a6e",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px 0"
};

const alternativeItem = {
    color: "#0369a1",
    fontSize: "14px",
    margin: "0 0 8px 0",
    lineHeight: "1.4"
};

const alternativeText = {
    color: "#0369a1",
    fontSize: "14px",
    margin: "12px 0 0 0"
};

const supportLink = {
    color: "#2563eb",
    textDecoration: "none"
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
    color: "#ef4444",
    fontSize: "20px",
    fontFamily: "monospace",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    margin: "0"
};

const instructionsText = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "0"
};

const instructionLink = {
    color: "#2563eb",
    textDecoration: "none"
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

const securityLink = {
    color: "#dc2626",
    textDecoration: "none"
};
