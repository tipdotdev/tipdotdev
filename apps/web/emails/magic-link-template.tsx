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

interface MagicLinkTemplateProps {
    url: string;
    token: string;
    email: string;
    date: string;
}

export const MagicLinkTemplate = ({ url, token, email, date }: MagicLinkTemplateProps) => (
    <Html>
        <Head />
        <Preview>Sign in to your tip.dev account - Authentication request</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <Section style={header}>
                    <Row>
                        <Column>
                            <Text style={headerTitle}>{"{$}"} tip&#8203;.dev</Text>
                            <Text style={headerSubtitle}>{"> authentication_request"}</Text>
                        </Column>
                        <Column style={headerRight}>
                            <Text style={signInBadge}>SIGN IN</Text>
                        </Column>
                    </Row>
                </Section>

                {/* Welcome Message */}
                <Section style={contentSection}>
                    <Text style={welcomeTitle}>Welcome back!</Text>
                    <Text style={welcomeText}>
                        Click the button below to sign in to your tip.dev account. This link will
                        expire in 5 minutes for security.
                    </Text>

                    {/* Magic Link Button */}
                    <Section style={buttonSection}>
                        <Button href={url} style={magicLinkButton}>
                            Sign in to tip.dev
                        </Button>
                        <Text style={buttonSubtext}>One-click secure sign in</Text>
                    </Section>

                    {/* Manual Token Section */}
                    <Section style={manualSection}>
                        <Text style={manualTitle}>Manual Sign In</Text>
                        <Text style={manualText}>
                            If the button above doesn&apos;t work, you can manually enter this
                            verification code on the sign-in page:
                        </Text>

                        {/* Token Display */}
                        <Section style={tokenContainer}>
                            <Row>
                                <Column>
                                    <Text style={tokenLabel}>{"> verification_token:"}</Text>
                                    <Text style={tokenValue}>{token}</Text>
                                </Column>
                            </Row>
                        </Section>
                    </Section>

                    {/* Security Notice */}
                    <Section style={securitySection}>
                        <Row style={securityRow}>
                            <Column style={iconColumn}>
                                <Text style={warningIcon}>⚠️</Text>
                            </Column>
                            <Column>
                                <Text style={securityTitle}>Security Notice</Text>
                                <Text style={securityText}>
                                    This sign-in link and verification code will expire in{" "}
                                    <strong>5 minutes</strong>. Never share this email or code with
                                    anyone. tip.dev will never ask for your security info via email.
                                </Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Account Info */}
                    <Section style={accountSection}>
                        <Text style={accountTitle}>Account Details</Text>
                        <Text style={accountDetail}>
                            <strong>Email:</strong> {email}
                        </Text>
                        <Text style={accountDetail}>
                            <strong>Sign-in requested:</strong> {date}
                        </Text>
                    </Section>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        Didn&apos;t request this sign-in?{" "}
                        <Link href="mailto:security@tip.dev" style={securityLink}>
                            Report suspicious activity
                        </Link>
                    </Text>
                    <Text style={footerSmall}>This email was sent to {email} from tip.dev</Text>
                </Section>

                {/* Terminal Footer */}
                <Section style={terminalFooter}>
                    <Text style={terminalText}>{">"} tip&#8203;.dev --auth --secure</Text>
                    <Text style={terminalSubtext}>{"> welcome_back_developer()"}</Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

MagicLinkTemplate.PreviewProps = {
    url: "https://tip.dev/auth/verify?token=ABC-DEF-123-456",
    token: "ABC-DEF-123-456",
    email: "developer@example.com",
    date: "May 30, 2025 at 8:42 PM"
};

export default MagicLinkTemplate;

// Styles
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

const signInBadge = {
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

const contentSection = {
    padding: "24px"
};

const welcomeTitle = {
    color: "#111827",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 8px 0"
};

const welcomeText = {
    color: "#6b7280",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "0 0 24px 0"
};

const buttonSection = {
    textAlign: "center" as const,
    marginBottom: "32px"
};

const magicLinkButton = {
    backgroundColor: "#000000",
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

const iconColumn = {
    width: "24px",
    paddingRight: "12px"
};

const securitySection = {
    backgroundColor: "#fefce8",
    border: "1px solid #fde047",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px"
};

const securityRow = {
    verticalAlign: "top"
};

const warningIcon = {
    fontSize: "20px",
    margin: "0"
};

const securityTitle = {
    color: "#92400e",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 4px 0"
};

const securityText = {
    color: "#a16207",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "0"
};

const accountSection = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px"
};

const accountTitle = {
    color: "#111827",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 8px 0"
};

const accountDetail = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 4px 0"
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

const securityLink = {
    color: "#dc2626",
    textDecoration: "none"
};

const footerSmall = {
    color: "#9ca3af",
    fontSize: "12px",
    margin: "0"
};

const terminalFooter = {
    backgroundColor: "#000000",
    padding: "16px",
    textAlign: "center" as const
};

const terminalText = {
    color: "#ffffff",
    fontSize: "14px",
    fontFamily: "monospace",
    margin: "0 0 4px 0"
};

const terminalSubtext = {
    color: "#d1d5db",
    fontSize: "14px",
    fontFamily: "monospace",
    margin: "0"
};
