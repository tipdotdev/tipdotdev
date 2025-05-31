import { Column, Row, Section, Text } from "@react-email/components";

interface InfoCalloutProps {
    icon?: string;
    title: string;
    message: string;
}

export const InfoCallout = ({ icon, title, message }: InfoCalloutProps) => (
    <Section style={infoCallout}>
        <Row style={infoRow}>
            <Column style={iconColumn}>
                <Text style={infoIcon}>{icon}</Text>
            </Column>
            <Column>
                <Text style={infoTitle}>{title}</Text>
                <Text style={infoMessage}>{message}</Text>
            </Column>
        </Row>
    </Section>
);

export const SuccessCallout = ({ icon, title, message }: InfoCalloutProps) => (
    <Section style={successSection}>
        <Row style={successRow}>
            <Column style={iconColumn}>
                <Text style={successIcon}>{icon}</Text>
            </Column>
            <Column>
                <Text style={successTitle}>{title}</Text>
                <Text style={successMessage}>{message}</Text>
            </Column>
        </Row>
    </Section>
);

const successRow = {
    verticalAlign: "top"
};

const successIcon = {
    fontSize: "24px",
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

const infoCallout = {
    backgroundColor: "#eff6ff",
    borderLeft: "4px solid #3b82f6",
    padding: "16px"
};

const infoRow = {
    verticalAlign: "top"
};

const iconColumn = {
    width: "32px",
    paddingRight: "12px"
};

const infoIcon = {
    fontSize: "24px",
    margin: "0"
};

const infoTitle = {
    color: "#1e40af",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 4px 0"
};

const infoMessage = {
    color: "#1d4ed8",
    fontSize: "14px",
    margin: "0"
};
