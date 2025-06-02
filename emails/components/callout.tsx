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

export const ErrorCallout = ({ icon, title, message }: InfoCalloutProps) => (
    <Section style={errorSection}>
        <Row style={errorRow}>
            <Column style={iconColumn}>
                <Text style={errorIcon}>{icon}</Text>
            </Column>
            <Column>
                <Text style={errorTitle}>{title}</Text>
                <Text style={errorMessage}>{message}</Text>
            </Column>
        </Row>
    </Section>
);

const errorSection = {
    backgroundColor: "#fef2f2",
    borderLeft: "4px solid #f87171",
    padding: "16px"
};

const errorRow = {
    verticalAlign: "top"
};

const errorIcon = {
    fontSize: "24px",
    margin: "0"
};

const errorTitle = {
    color: "#991b1b",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 4px 0"
};

const errorMessage = {
    color: "#b91c1c",
    fontSize: "14px",
    margin: "0"
};

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
