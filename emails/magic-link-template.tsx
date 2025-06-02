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
import { EmailTerminalFooter } from "./components/footer";
import { EmailHeader } from "./components/header";

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
                <EmailHeader badgeLabel="SIGN IN" title="magic_link" />

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
                    <WarningAlert
                        title="Security Notice"
                        message="This sign-in link and verification code will expire in 5 minutes. Never share this email or code with anyone. tip.dev will never ask for your security info via email."
                    />

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
                <EmailTerminalFooter
                    text="tip&#8203;.dev --auth --secure"
                    subtext="welcome_back_developer()"
                />
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
