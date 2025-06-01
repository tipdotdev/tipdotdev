import { getNotificationPreferencesByEmail } from "@/actions/notifications";
import DeleteAccountTemplate from "@/emails/delete-account-template";
import EmailChangeConfirmation from "@/emails/email-change-confirmation-template";
import MagicLinkTemplate from "@/emails/magic-link-template";
import TipReceiptEmail from "@/emails/tip-reciept-template";
import TipReceivedEmail from "@/emails/tip-recieved-template";
import VerifyEmailTemplate from "@/emails/verify-email-template";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { SES } from "@aws-sdk/client-ses";
import { render } from "@react-email/components";

const ses = new SES({
    region: process.env.AWS_SES_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});
const fromEmail = "tip.dev <no-reply@mail.tip.dev>";

type EmailResponse = {
    success: boolean;
    error?: string;
};

export async function sendMagicLink(
    email: string,
    url: string,
    token: string
): Promise<EmailResponse> {
    const date = new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    const emailHTML = await render(MagicLinkTemplate({ url, token, email, date }));
    const params: SendEmailCommandInput = {
        Source: fromEmail,
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: emailHTML
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Sign in to tip.dev - Magic Link"
            }
        }
    };
    const res = await ses.sendEmail(params);

    if (res.$metadata.httpStatusCode !== 200) {
        return {
            success: false,
            error: `Failed to send magic link: ${res.$metadata.httpStatusCode}`
        };
    }

    return {
        success: true
    };
}

interface TipReceiptEmail {
    senderEmail: string;
    recieverEmail: string;
    recieverUsername: string;
    recieverAvatar: string;
    recieverBio?: string;
    message?: string;
    amount: number;
    processingFee: number;
    applicationFee: number;
    date: string;
    tipId: string;
    paymentMethod: string;
}

export async function sendTipReceipts(data: TipReceiptEmail): Promise<EmailResponse> {
    const formattedDate = new Date(data.date).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const senderEmailHtml = await render(
        TipReceiptEmail({
            senderEmail: data.senderEmail,
            recieverUsername: data.recieverUsername,
            recieverAvatar: data.recieverAvatar,
            recieverBio: data.recieverBio,
            message: data.message,
            amount: data.amount,
            processingFee: 0,
            date: formattedDate,
            tipId: data.tipId,
            paymentMethod: data.paymentMethod
        })
    );

    const recieverEmailHtml = await render(
        TipReceivedEmail({
            amount: data.amount,
            transactionId: data.tipId,
            receivedOn: formattedDate,
            platformFee: data.applicationFee,
            tipperEmail: data.senderEmail,
            recieverEmail: data.recieverEmail,
            message: data.message || "",
            processingFee: data.processingFee
        })
    );

    const senderEmailParams: SendEmailCommandInput = {
        Source: fromEmail,
        Destination: {
            ToAddresses: [data.senderEmail]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: senderEmailHtml
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "tip.dev Transaction Receipt"
            }
        }
    };

    const recieverEmailParams: SendEmailCommandInput = {
        Source: fromEmail,
        Destination: {
            ToAddresses: [data.recieverEmail]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: recieverEmailHtml
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "You received a tip! - tip.dev"
            }
        }
    };

    const senderEmailRes = await ses.sendEmail(senderEmailParams);
    if (senderEmailRes.$metadata.httpStatusCode !== 200) {
        return {
            success: false,
            error: `Failed to send tip receipt: ${senderEmailRes.$metadata.httpStatusCode}`
        };
    }

    const notifPrefs = await getNotificationPreferencesByEmail(data.recieverEmail);
    if (notifPrefs?.emailOnTip) {
        const recieverEmailRes = await ses.sendEmail(recieverEmailParams);
        if (recieverEmailRes.$metadata.httpStatusCode !== 200) {
            return {
                success: false,
                error: `Failed to send tip notification: ${recieverEmailRes.$metadata.httpStatusCode}`
            };
        }
    }

    return {
        success: true
    };
}

export async function sendEmailChangeConfirmation(
    oldEmail: string,
    newEmail: string,
    url: string,
    token: string
): Promise<EmailResponse> {
    const date = new Date();

    const emailHTML = await render(
        EmailChangeConfirmation({
            oldEmail,
            newEmail,
            url,
            token,
            requestedAt: date
        })
    );

    const params: SendEmailCommandInput = {
        Source: fromEmail,
        Destination: {
            ToAddresses: [newEmail]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: emailHTML
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "tip.dev Email Change Confirmation"
            }
        }
    };

    const res = await ses.sendEmail(params);
    if (res.$metadata.httpStatusCode !== 200) {
        return {
            success: false,
            error: `Failed to send email change confirmation: ${res.$metadata.httpStatusCode}`
        };
    }

    return {
        success: true
    };
}

export async function sendVerifyEmail(
    email: string,
    url: string,
    token: string,
    userName?: string
): Promise<EmailResponse> {
    const emailHTML = await render(VerifyEmailTemplate({ url, token, email, userName }));

    const params: SendEmailCommandInput = {
        Source: fromEmail,
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: emailHTML
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Verify your email address - tip.dev"
            }
        }
    };

    const res = await ses.sendEmail(params);

    if (res.$metadata.httpStatusCode !== 200) {
        return {
            success: false,
            error: `Failed to send verify email: ${res.$metadata.httpStatusCode}`
        };
    }

    return {
        success: true
    };
}

export async function sendAccountDeletion(
    email: string,
    url: string,
    token: string,
    userName?: string
): Promise<EmailResponse> {
    const emailHTML = await render(
        DeleteAccountTemplate({ url, token, email, userName, requestedAt: new Date() })
    );

    const params: SendEmailCommandInput = {
        Source: fromEmail,
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: emailHTML
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Delete your tip.dev account - Account Deletion Request"
            }
        }
    };

    const res = await ses.sendEmail(params);

    if (res.$metadata.httpStatusCode !== 200) {
        return {
            success: false,
            error: `Failed to send delete account email: ${res.$metadata.httpStatusCode}`
        };
    }

    return {
        success: true
    };
}
