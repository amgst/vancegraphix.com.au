const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const runtimeConfig = typeof functions.config === "function" ? functions.config() : {};

const RESEND_API_URL = "https://api.resend.com/emails";

function formatHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br />");
}

async function sendEmail({ to, subject, text, replyTo }) {
    const apiKey = process.env.RESEND_API_KEY || runtimeConfig?.resend?.api_key;
    const fromEmail = process.env.RESEND_FROM_EMAIL || runtimeConfig?.resend?.from_email;
    const fromName = process.env.EMAIL_FROM_NAME || runtimeConfig?.email?.from_name || "Vance Graphix & Print";

    if (!apiKey || !fromEmail) {
        console.error("Missing RESEND_API_KEY or RESEND_FROM_EMAIL.");
        return;
    }

    const payload = {
        from: `"${fromName}" <${fromEmail}>`,
        to: [to],
        subject,
        text,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.5">${formatHtml(text)}</div>`,
    };

    if (replyTo) {
        payload.reply_to = replyTo;
    }

    try {
        const response = await fetch(RESEND_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Resend API error (${response.status}):`, errorText);
            return;
        }

        const result = await response.json();
        console.log("Email sent successfully to:", to, "id:", result.id);
    } catch (error) {
        console.error("Error sending email via Resend:", error);
    }
}

exports.onInquiryCreated = functions.firestore
    .document("inquiries/{docId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();
        
        // Send Email Notification
        const adminEmail = process.env.ADMIN_EMAIL || runtimeConfig?.notifications?.admin_email;
        if (adminEmail) {
            const subject = `New Project Inquiry: ${data.serviceType} from ${data.name}`;
            const text = `
New Project Inquiry Received!

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.serviceType}
Timeline: ${data.timeline}

Additional Info:
${data.additionalInfo}

View details: https://www.vancegraphix.com.au/admin/inquiries
            `;
            await sendEmail({
                to: adminEmail,
                subject,
                text,
                replyTo: data.email,
            });
        }
    });

exports.onContactCreated = functions.firestore
    .document("contact_messages/{docId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();

        // Send Email Notification
        const adminEmail = process.env.ADMIN_EMAIL || runtimeConfig?.notifications?.admin_email;
        if (adminEmail) {
            const subject = `New Contact Message from ${data.firstName} ${data.lastName}`;
            const text = `
New Contact Message Received!

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Service: ${data.service}

Message:
${data.message}

View details: https://www.vancegraphix.com.au/admin/dashboard
            `;
            await sendEmail({
                to: adminEmail,
                subject,
                text,
                replyTo: data.email,
            });
        }
    });
