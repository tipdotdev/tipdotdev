import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components";

interface MagicLinkTemplateProps {
    url: string;
    token: string;
}

export const MagicLinkTemplate = ({ url, token }: MagicLinkTemplateProps) => (
    <Html>
        <Head />
        <Body style={main}>
            <Preview>Sign in with this magic link</Preview>
            <Container style={container}>
                <Heading style={h1}>{"{$}"}</Heading>
                <Heading style={h1}>Sign in to tip.dev</Heading>
                <Link
                    href={url}
                    target="_blank"
                    style={{
                        ...link,
                        display: "block",
                        marginBottom: "16px"
                    }}
                >
                    Click here to sign in with this magic link
                </Link>
                <Text style={{ ...text, marginBottom: "14px" }}>
                    Or, copy and paste this temporary sign in token:
                </Text>
                <code style={code}>{token}</code>
                <Text
                    style={{
                        ...text,
                        color: "#ababab",
                        marginTop: "14px",
                        marginBottom: "16px"
                    }}
                >
                    If you didn&apos;t try to sign in, you can safely ignore this email.
                </Text>
                <Text style={footer}>
                    <Link
                        href="https://tip.dev"
                        target="_blank"
                        style={{ ...link, color: "#898989" }}
                    >
                        {"{$}"} tip.dev
                    </Link>
                    , make money doing what you love.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default MagicLinkTemplate;

const main = {
    backgroundColor: "#ffffff"
};

const container = {
    paddingLeft: "12px",
    paddingRight: "12px",
    margin: "0 auto"
};

const h1 = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "40px 0",
    padding: "0"
};

const link = {
    color: "#2754C5",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    textDecoration: "underline"
};

const text = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    margin: "24px 0"
};

const footer = {
    color: "#898989",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "12px",
    lineHeight: "22px",
    marginTop: "12px",
    marginBottom: "24px"
};

const code = {
    display: "inline-block",
    padding: "16px 4.5%",
    width: "90.5%",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
    border: "1px solid #eee",
    color: "#333"
};
