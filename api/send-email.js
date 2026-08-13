/* ==========================================================================
   UNIVERSITY OF EAST FLORIDA - NODEMAILER EMAIL DISPATCH API ROUTE
   Sends automated application receipts & registrar email notifications
   ========================================================================== */

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, fullName, studentEmail, programTitle, highestQual, inquiryName, inquiryEmail } = req.body || {};

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'r.mohammedsafar@gmail.com',
        pass: process.env.EMAIL_PASS || 'demo-app-password'
      }
    });

    if (type === 'inquiry') {
      if (!inquiryName || !inquiryEmail) {
        return res.status(400).json({ error: 'Missing required parameters: inquiryName or inquiryEmail' });
      }

      const inquiryMailOptions = {
        from: '"UEF Admissions & Registrar Office" <r.mohammedsafar@gmail.com>',
        to: inquiryEmail,
        bcc: 't06546666@gmail.com',
        replyTo: 'r.mohammedsafar@gmail.com',
        subject: `🎓 UEF Inquiry Confirmation - ${inquiryName}`,
        html:           <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; padding: 20px; border-radius: 12px; max-width: 580px; width: 100%; margin: 0 auto; border: 1px solid #d4af37; box-shadow: 0 4px 15px rgba(0,0,0,0.05); box-sizing: border-box;">
            <div style="text-align: center; border-bottom: 2px solid #6b111c; padding-bottom: 16px; margin-bottom: 20px;">
              <img src="https://un-mu.vercel.app/assets/logo.jpg" alt="UEF Logo" style="width: 75px; height: 75px; margin-bottom: 10px;" />
              <h1 style="color: #6b111c; margin: 0; font-size: 20px;">UNIVERSITY OF EAST FLORIDA</h1>
              <p style="color: #d4af37; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">100% Online Global Campus • Orlando, USA</p>
            </div>
            
            <h2 style="color: #6b111c; font-size: 17px; margin-bottom: 15px;">💬 Inquiry Received &amp; Confirmed</h2>
            
            <p style="font-size: 14px; line-height: 1.6; color: #444;">
              Dear <strong>${inquiryName || 'Student'}</strong>,<br><br>
              Thank you for reaching out to the University of East Florida! We have successfully received your inquiry regarding <strong>${programTitle || 'our online degree programs'}</strong>.
            </p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #faf8f5; border: 1px solid #d4af37; border-radius: 8px; margin: 20px 0;">
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; color: #666; width: 35%;">Applicant Name:</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: bold; color: #111; word-break: break-word;">${inquiryName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Email Address:</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: bold; color: #111; word-break: break-all; word-wrap: break-word; overflow-wrap: anywhere;">${inquiryEmail}</td>
              </tr>
              ${req.body.phone ? `
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Phone Number:</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: bold; color: #111; word-break: break-word;">${req.body.phone}</td>
              </tr>` : ''}
              ${programTitle ? `
              <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #666;">Program Interested:</td>
                <td style="padding: 10px 14px; font-size: 14px; font-weight: bold; color: #111; word-break: break-word;">${programTitle}</td>
              </tr>` : ''}
            </table>

            <p style="font-size: 13px; line-height: 1.6; color: #555;">
              Our Admissions &amp; Academic Counselor will review your request and contact you within 24 hours with complete curriculum specifications, tuition options, and scholarship details.
            </p>

            <p style="font-size: 11px; color: #888; text-align: center; margin-top: 25px; border-top: 1px solid #eaeaea; padding-top: 16px; line-height: 1.5;">
              University Registrar Office • 1200 University Blvd, Suite 500, Orlando, FL 32816, USA<br>
              Official Contact: r.mohammedsafar@gmail.com | Toll-Free: +1 (800) 555-UEF1
            </p>
          </div>
        `
      };
      await transporter.sendMail(inquiryMailOptions);
      return res.status(200).json({ success: true, message: `Inquiry confirmation sent to ${inquiryEmail} and registrar.` });
    }

    if (!studentEmail) {
      return res.status(400).json({ error: 'Missing required parameters: studentEmail' });
    }

    const mailOptions = {
      from: '"UEF Registrar Office" <r.mohammedsafar@gmail.com>',
      to: studentEmail,
      bcc: 't06546666@gmail.com',
      subject: `🎓 UEF Official Application Receipt`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; padding: 20px; border-radius: 12px; max-width: 580px; width: 100%; margin: 0 auto; border: 1px solid #d4af37; box-shadow: 0 4px 15px rgba(0,0,0,0.05); box-sizing: border-box;">
          <div style="text-align: center; border-bottom: 2px solid #6b111c; padding-bottom: 16px; margin-bottom: 20px;">
            <img src="https://un-mu.vercel.app/assets/logo.jpg" alt="UEF Logo" style="width: 75px; height: 75px; margin-bottom: 10px;" />
            <h1 style="color: #6b111c; margin: 0; font-size: 20px;">UNIVERSITY OF EAST FLORIDA</h1>
            <p style="color: #d4af37; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">100% Online Global Campus • Orlando, USA</p>
          </div>
          
          <h2 style="color: #6b111c; font-size: 17px; margin-bottom: 15px;">📥 Official Application Receipt</h2>
          
          <p style="font-size: 14px; line-height: 1.6; color: #444;">
            Dear <strong>${fullName || 'Student'}</strong>,<br><br>
            Thank you for applying to the University of East Florida. Your official application has been received and verified by the Registrar Office.
          </p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #faf8f5; border: 1px solid #d4af37; border-radius: 8px; margin: 20px 0;">
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; color: #666; width: 35%;">Target Program:</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: bold; color: #111; word-break: break-word;">${programTitle || 'Degree Program'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Highest Qualification:</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: bold; color: #111; word-break: break-word;">${highestQual || 'Undergraduate'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-size: 13px; color: #666;">Student Email:</td>
              <td style="padding: 10px 14px; font-size: 14px; font-weight: bold; color: #111; word-break: break-all; word-wrap: break-word; overflow-wrap: anywhere;">${studentEmail}</td>
            </tr>
          </table>

          <p style="font-size: 11px; color: #888; text-align: center; margin-top: 25px; border-top: 1px solid #eaeaea; padding-top: 16px; line-height: 1.5;">
            University Registrar Office • 1200 University Blvd, Suite 500, Orlando, FL 32816, USA<br>
            Official Contact: r.mohammedsafar@gmail.com | Toll-Free: +1 (800) 555-UEF1
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: `Email dispatched to ${studentEmail} and Registrar.` });
  } catch (error) {
    console.error("Nodemailer Email error:", error);
    return res.status(500).json({ error: error.message });
  }
}
