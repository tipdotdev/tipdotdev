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
import { InfoAlert } from "./components/alert";
import { InfoCallout } from "./components/callout";
import { EmailTerminalFooter } from "./components/footer";
import { EmailHeader } from "./components/header";

interface EmailVerificationProps {
    email: string;
    url: string;
    token: string;
    userName?: string;
}

export default function VerifyEmailTemplate({
    email,
    url,
    token,
    userName
}: EmailVerificationProps) {
    return (
        <Html>
            <Head />
            <Preview>Welcome to tip.dev! Please verify your email address to get started.</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <EmailHeader badgeLabel="VERIFY" title="Email Verification" badgeType="info" />

                    <InfoCallout
                        icon="📧"
                        title="Almost there!"
                        message="Just one quick step to activate your tip.dev account."
                    />

                    {/* Main Content */}
                    <Section style={contentSection}>
                        <Text style={mainTitle}>
                            {userName ? `Hey ${userName}!` : "Welcome to tip.dev!"}
                        </Text>
                        <Text style={mainText}>
                            Thanks for signing up! We just need to verify that{" "}
                            <strong>{email}</strong> belongs to you. Click the button below to
                            confirm your email address and start receiving tips.
                        </Text>

                        {/* Verification Button */}
                        <Section style={buttonSection}>
                            <Button href={url} style={verifyButton}>
                                Verify Email Address
                            </Button>
                            <Text style={buttonSubtext}>
                                This will activate your account instantly
                            </Text>
                        </Section>

                        {/* Benefits Section */}
                        <Section style={benefitsSection}>
                            <Text style={benefitsTitle}>What happens after verification?</Text>
                            <Text style={benefitItem}>🚀 Your tip.dev profile goes live</Text>
                            <Text style={benefitItem}>💰 Start receiving tips from supporters</Text>
                            <Text style={benefitItem}>📊 Access your creator dashboard</Text>
                            <Text style={benefitItem}>🔔 Get notified when tips come in</Text>
                        </Section>

                        {/* Manual Token Section */}
                        <Section style={manualSection}>
                            <Text style={manualTitle}>Alternative Verification</Text>
                            <Text style={manualText}>
                                Button not working? No worries! You can also verify by entering this
                                code on our verification page:
                            </Text>

                            {/* Token Display */}
                            <Section style={tokenContainer}>
                                <Row>
                                    <Column>
                                        <Text style={tokenLabel}>{"> verification_code:"}</Text>
                                        <Text style={tokenValue}>{token}</Text>
                                    </Column>
                                </Row>
                            </Section>

                            <Text style={instructionsText}>
                                Go to{" "}
                                <Link href="https://tip.dev/verify-email" style={instructionLink}>
                                    tip.dev/verify-email
                                </Link>{" "}
                                and enter the code above.
                            </Text>
                        </Section>

                        {/* Helpful Info */}
                        <InfoAlert
                            title="Quick heads up"
                            message="This verification link will expire in 24 hours. If it expires, just request a new one from the sign-in page."
                        />

                        {/* Account Details */}
                        <Section style={detailsSection}>
                            <Text style={detailsTitle}>Account Details</Text>
                            <Text style={detailItem}>
                                <strong>Email:</strong> {email}
                            </Text>
                            <Text style={detailItem}>
                                <strong>Status:</strong> Pending verification
                            </Text>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Questions about verification?{" "}
                            <Link href="mailto:support@tip.dev" style={supportLink}>
                                We&apos;re here to help
                            </Link>
                        </Text>
                        <Text style={footerSmall}>This email was sent to {email} from tip.dev</Text>
                    </Section>

                    <EmailTerminalFooter
                        text="tip&#8203;.dev --verify --welcome"
                        subtext="ready_to_start_creating()"
                    />
                </Container>
            </Body>
        </Html>
    );
}

VerifyEmailTemplate.PreviewProps = {
    email: "creator@example.com",
    url: "https://tip.dev/verify?token=ABC-DEF-123-456",
    token: "ABC-DEF-123-456",
    userName: "Alex"
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

const buttonSection = {
    textAlign: "center" as const,
    marginBottom: "32px"
};

const verifyButton = {
    backgroundColor: "#059669",
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

const benefitsSection = {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "24px"
};

const benefitsTitle = {
    color: "#065f46",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px 0"
};

const benefitItem = {
    color: "#047857",
    fontSize: "14px",
    margin: "0 0 8px 0",
    lineHeight: "1.4"
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
    color: "#10b981",
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

const supportLink = {
    color: "#2563eb",
    textDecoration: "none"
};
