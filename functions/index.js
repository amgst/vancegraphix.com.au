const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure the email transport using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendEmail(to, subject, text, html) {
    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: text,
        html: html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

exports.onInquiryCreated = functions.firestore
    .document("inquiries/{docId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();
        
        // Send Email Notification
        const adminEmail = process.env.ADMIN_EMAIL;
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

View details: https://www.wbify.com/admin/inquiries
            `;
            await sendEmail(adminEmail, subject, text);
        }
    });

exports.onContactCreated = functions.firestore
    .document("contact_messages/{docId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();

        // Send Email Notification
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            const subject = `New Contact Message from ${data.firstName} ${data.lastName}`;
            const text = `
New Contact Message Received!

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Service: ${data.service}

Message:
${data.message}

View details: https://www.wbify.com/admin/dashboard
            `;
            await sendEmail(adminEmail, subject, text);
        }
    });
