const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a test account on Ethereal
  const testAccount = await nodemailer.createTestAccount();

  // 2. Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // 3. Define the email options
  const mailOptions = {
    from: '"Inventory Management System" <no-reply@ims.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // 4. Send the email
  const info = await transporter.sendMail(mailOptions);

  // 5. Log the preview URL
  console.log('Message sent: %s', info.messageId);
  console.log('📬 Preview email at: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;