// TODO with .ics file
const { writeFileSync } = require('fs')
const ics = require('ics')
const nodemailer = require('nodemailer');

function sendConfirmedReservation() {

  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    // Create the ICS event
    let icsFile;
    ics.createEvent({
      title: 'Dinner Reservation',
      description: `Reservation for aaa bbb, X guests, Table >`,
      busyStatus: 'FREE',
      start: [2026, 1, 1, 1, 1],
      duration: { minutes: 120 }
    }, async (error, value) => {
      if (error) {
        console.log(error);
        return;
      }
      icsFile = value
    })

    const html = `
      <h2>Reservation Details</h2>
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:2rem auto; padding:2rem; background-color:#f9fafb; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color:#111827; text-align:center; margin-bottom:1rem;">Bestätigung deiner Reservierung</h2>
        <p style="color:#4b5563; text-align:center; margin-bottom:2rem;">Danke, dass du bei Webtechquila reserviert hast! Hier sind die Details deiner Reservierung:</p>
        <div style="background-color:#ffffff; padding:1.5rem; border-radius:6px; border:1px solid #e5e7eb;">
          <ul style="list-style:none; padding:0; margin:0;">
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Date:</strong> aaa</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Time:</strong> bbb</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Guests:</strong> ccc</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Table ID:</strong> ddd</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Name:</strong> eee fff</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Customer Note:</strong> ggg</li>
          </ul>
        </div>
      </div>
    `;

    // Message object
    let message = {
      from: 'Sender Name <sender@example.com>',
      to: 'Recipient <recipient@example.com>',
      subject: 'Nodemailer is unicode friendly ✔',
      text: 'Webtechquila und so  ',
      html: html,
      attachments: [
        {
          filename: 'Reservierung.ics',
          content: icsFile,
          contentType: 'text/calendar'
        }
      ]
    };



    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });

}

sendConfirmedReservation()