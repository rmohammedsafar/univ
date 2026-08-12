/* ==========================================================================
   UNIVERSITY OF EAST FLORIDA - NODEMAILER EMAIL DISPATCH API ROUTE
   Sends automated application receipts & registrar email notifications
   ========================================================================== */

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, fullName, studentEmail, programTitle, status, highestQual, inquiryName, inquiryEmail } = req.body || {};

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
        from: '"UEF Website" <r.mohammedsafar@gmail.com>',
        to: 't06546666@gmail.com',
        replyTo: inquiryEmail,
        subject: `New Inquiry from ${inquiryName} [UEF]`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #d4af37; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 2px solid #6b111c; padding-bottom: 20px; margin-bottom: 20px;">
              <img src="https://un-mu.vercel.app/assets/logo.jpg" alt="UEF Logo" style="width: 80px; height: 80px; border-radius: 50%;" />
              <h1 style="color: #6b111c; margin: 10px 0 0 0; font-size: 20px;">UNIVERSITY OF EAST FLORIDA</h1>
            </div>
            <h2 style="color: #6b111c; text-align: center; font-size: 18px;">New Contact Request</h2>
            <p><strong>Student Name:</strong> ${inquiryName}</p>
            <p><strong>Email Address:</strong> ${inquiryEmail}</p>
            <p style="margin-top: 20px; font-size: 13px; color: #666; border-top: 1px solid #eee; padding-top: 15px;">
              This inquiry was submitted via the website's footer form. You can reply directly to this email to contact the student.
            </p>
          </div>
        `
      };
      await transporter.sendMail(inquiryMailOptions);
      return res.status(200).json({ success: true, message: `Inquiry sent to registrar.` });
    }

    if (!studentEmail) {
      return res.status(400).json({ error: 'Missing required parameters: studentEmail' });
    }



    const mailOptions = {
      from: '"UEF Registrar Office" <r.mohammedsafar@gmail.com>',
      to: studentEmail,
      bcc: 't06546666@gmail.com',
      subject: `🎓 UEF Official Application Receipt & Admission Decision`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #d4af37; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="text-align: center; border-bottom: 2px solid #6b111c; padding-bottom: 20px; margin-bottom: 20px;">
            <img src="https://un-mu.vercel.app/assets/logo.jpg" alt="UEF Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;" />
            <h1 style="color: #6b111c; margin: 0; font-size: 22px;">UNIVERSITY OF EAST FLORIDA</h1>
            <p style="color: #d4af37; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">100% Online Global Campus • Orlando, USA</p>
          </div>
          
          <h2 style="color: #15803d; font-size: 18px; margin-bottom: 15px;">🎉 Official Admission Decision Issued</h2>
          
          <p style="font-size: 15px; line-height: 1.6; color: #444;">
            Dear <strong>${fullName || 'Student'}</strong>,<br><br>
            Thank you for applying to the University of East Florida. Your official application has been received and verified by the Registrar Office.
          </p>

          <div style="background: #faf8f5; border: 1px solid #d4af37; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
              <span style="color: #666; font-size: 13px;">Target Program:</span>
              <strong style="color: #222;">${programTitle || 'Degree Program'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
              <span style="color: #666; font-size: 13px;">Highest Qualification:</span>
              <strong style="color: #222;">${highestQual || 'Undergraduate'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 4px;">
              <span style="color: #666; font-size: 13px; font-weight: bold;">Admission Decision:</span>
              <strong style="color: #15803d; font-size: 14px;">${status || 'ADMITTED (UNCONDITIONAL)'}</strong>
            </div>
          </div>

          <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 20px;">
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
