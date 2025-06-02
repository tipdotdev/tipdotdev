import { Column, Row, Section, Text } from "@react-email/components";

interface AlertProps {
    title: string;
    message: string;
}

export const WarningAlert = ({ title, message }: AlertProps) => (
    <Section style={securitySection}>
        <Row style={securityRow}>
            <Column style={iconColumn}>
                <Text style={warningIcon}>⚠️</Text>
            </Column>
            <Column>
                <Text style={securityTitle}>{title}</Text>
                <Text style={securityText}>{message}</Text>
            </Column>
        </Row>
    </Section>
);

export const InfoAlert = ({ title, message }: AlertProps) => (
    <Section style={messageSection}>
        <Text style={messageTitle}>{title}</Text>
        <Text style={messageText}>{message}</Text>
    </Section>
);

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
