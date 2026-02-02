const nodemailer = require('nodemailer');
const ics = require('ics')

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

    // Create the ICS event

    // Convert date/time to numbers for ICS
    const [year, month, day] = data.date.split("-").map(Number);
    const [hour, minute] = data.time.split(":").map(Number);

    let icsFile;
    ics.createEvent({
      title: "Tischreservierung Webtechquila",
      description: `Reservierung für ${data.firstName} ${data.lastName}, ${data.guests} Gäste, Tischnummer ${data.tableId}\nKundennotiz: ${data.customerNote}`,
      busyStatus: "BUSY",
      start: [year, month, day, hour, minute],
      duration: { minutes: 120 }
    }, (error, value) => {
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
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Datum:</strong> ${data.date}</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Uhrzeit:</strong> ${data.time}</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Gäste:</strong> ${data.guests}</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Tischnummer:</strong> ${data.tableId}</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
            <li style="margin-bottom:0.75rem; font-size:14px;"><strong>Kunden Notiz:</strong> ${data.customerNote}</li>
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

module.exports = {
  sendAuthReservationURL,
  sendConfirmedReservation
}