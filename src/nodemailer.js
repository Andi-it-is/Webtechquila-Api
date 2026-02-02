// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

async function sendAuthReservationURL(url) {

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

    // Message object
    let message = {
      from: 'Sender Name <sender@example.com>',
      to: 'Recipient <recipient@example.com>',
      subject: 'Nodemailer is unicode friendly ✔',
      text: 'Webtechquila und so  ',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f7f9; padding: 24px; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 6px;" >
        <h2 style="margin-bottom: 16px; color: #111827;">
          Bestätige jetzt deine Reservierung bei Webtechquila!
        </h2>
        <p style="margin-bottom: 24px; color: #4b5563; font-size: 14px;">
          Drücke auf den Knopf um deine Bestellung zu bestätigen. Im Anschluss nach der Bestätigung erhälst du eine weitere Bestätigungsmail.
        </p>
        <a
          href="${url}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            font-weight: 600;
            border-radius: 4px;
          "
        >
          Reservierung bestätigen
        </a>
      </div >
    </div >
    `
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

// TODO with .ics file
async function sendConfirmedReservation(data) {

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

    const html = `
      <h2>Reservation Details</h2>
      <ul>
        <li><strong>Date:</strong> ${data.date}</li>
        <li><strong>Time:</strong> ${data.time}</li>
        <li><strong>Guests:</strong> ${data.guests}</li>
        <li><strong>Table ID:</strong> ${data.tableId}</li>
        <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
        <li><strong>Customer Note:</strong> ${data.customerNote}</li>
      </ul>
    `;

    // Message object
    let message = {
      from: 'Sender Name <sender@example.com>',
      to: 'Recipient <recipient@example.com>',
      subject: 'Nodemailer is unicode friendly ✔',
      text: 'Webtechquila und so  ',
      html: html
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

module.exports = {
  sendAuthReservationURL,
  sendConfirmedReservation
}