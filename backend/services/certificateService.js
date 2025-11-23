const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { uploadToCloudinary } = require('./fileUploadService');

/**
 * Generate certificate PDF
 * @param {Object} data - Certificate data
 * @returns {Promise<String>} - PDF file URL
 */
exports.generateCertificatePDF = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        internName,
        internshipTitle,
        completionDate,
        certificateId,
        skills,
        score
      } = data;

      // Create a document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 72, right: 72 }
      });

      // Buffer to store PDF
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(chunks);

        // Upload to Cloudinary
        try {
          const fileUrl = await uploadToCloudinary(
            {
              buffer: pdfBuffer,
              originalname: `certificate-${certificateId}.pdf`,
              mimetype: 'application/pdf'
            },
            'certificates'
          );
          resolve(fileUrl);
        } catch (uploadError) {
          reject(uploadError);
        }
      });

      // --- Watermark Start ---
      doc.save(); // Save current state
      doc.opacity(0.03); // Extremely low opacity for subtle background
      doc.font('Helvetica-Bold');
      doc.fontSize(20); // Smaller font size
      doc.fillColor('#000000');

      const watermarkText = 'TechFieldSolution';
      const angle = -45;
      const width = doc.page.width;
      const height = doc.page.height;

      // Adjusted spacing for high density
      const stepX = 200;
      const stepY = 100;

      // Rotate the entire context
      doc.rotate(angle, { origin: [width / 2, height / 2] });

      // Draw repeated text
      // Start from -width * 2 to ensure top-left coverage after rotation
      for (let x = -width * 2; x < width * 2; x += stepX) {
        // Offset every other row for a brick pattern
        const xOffset = (Math.floor((x + width * 2) / stepX) % 2 === 0) ? 0 : stepX / 2;

        for (let y = -height; y < height * 2; y += stepY) {
          doc.text(watermarkText, x + xOffset, y, {
            lineBreak: false
          });
        }
      }

      doc.restore(); // Restore state
      // --- Watermark End ---

      // --- Borders Start ---
      // Outer thick border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3)
        .strokeColor('#1a237e')
        .stroke();

      // Inner thin border
      doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56)
        .lineWidth(1)
        .strokeColor('#1a237e')
        .stroke();
      // --- Borders End ---

      // Title
      doc.fontSize(42)
        .font('Helvetica-Bold')
        .fillColor('#1a237e') // Deep Navy
        .text('Certificate of Completion', 0, 90, { align: 'center' });

      // Subtitle
      doc.fontSize(16)
        .font('Helvetica')
        .fillColor('#424242') // Dark Grey
        .text('This is to certify that', 0, 160, { align: 'center' });

      // Intern name
      doc.fontSize(36)
        .font('Helvetica-Bold')
        .fillColor('#0d47a1') // Rich Blue
        .text(internName, 0, 200, { align: 'center' });

      // Underline name
      const nameWidth = doc.widthOfString(internName);
      const underlinePadding = 60; // Increased padding for longer line
      doc.moveTo((doc.page.width - nameWidth) / 2 - underlinePadding, 245)
        .lineTo((doc.page.width + nameWidth) / 2 + underlinePadding, 245)
        .lineWidth(1)
        .strokeColor('#0d47a1')
        .stroke();

      // Description
      doc.fontSize(16)
        .font('Helvetica')
        .fillColor('#424242')
        .text('has successfully completed the internship program', 0, 270, { align: 'center' });

      // Internship title
      doc.fontSize(26)
        .font('Helvetica-Bold')
        .fillColor('#1a237e')
        .text(internshipTitle, 0, 310, { align: 'center' });

      // Skills
      if (skills && skills.length > 0) {
        doc.fontSize(12)
          .font('Helvetica')
          .fillColor('#616161') // Medium Grey
          .text(`Skills: ${skills.join(', ')}`, 0, 360, { align: 'center' });
      }

      // Score
      if (score) {
        doc.fontSize(14)
          .font('Helvetica-Bold')
          .fillColor('#2e7d32') // Green
          .text(`Final Score: ${score}%`, 0, 390, { align: 'center' });
      }

      // Date
      doc.fontSize(14)
        .font('Helvetica')
        .fillColor('#212121')
        .text(`Completion Date: ${new Date(completionDate).toLocaleDateString()}`, 0, 480, { align: 'center' });

      // Certificate ID
      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#757575')
        .text(`Certificate ID: ${certificateId}`, 0, 500, { align: 'center' });

      // Footer
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#1a237e')
        .text('TechFieldSolution', 100, doc.page.height - 110);

      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#616161')
        .text('www.techfieldsolution.com', 100, doc.page.height - 90);

      // Signature line
      doc.moveTo(doc.page.width - 300, doc.page.height - 110)
        .lineTo(doc.page.width - 100, doc.page.height - 110)
        .lineWidth(1)
        .strokeColor('#000000')
        .stroke();

      doc.fontSize(10)
        .fillColor('#000000')
        .text('Authorized Signature', doc.page.width - 300, doc.page.height - 90, {
          width: 200,
          align: 'center'
        });

      // --- QR Code Start ---
      try {
        const QRCode = require('qrcode');
        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${certificateId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1 });

        // Add QR Code image
        // Positioned high to avoid signature overlap
        doc.image(qrCodeDataUrl, doc.page.width - 170, doc.page.height - 250, {
          fit: [80, 80],
          align: 'center',
          valign: 'center'
        });

        doc.fontSize(8)
          .fillColor('#000000')
          .text('Scan to Verify', doc.page.width - 170, doc.page.height - 160, {
            width: 80,
            align: 'center'
          });
      } catch (qrError) {
        console.error('Failed to generate QR code:', qrError);
      }
      // --- QR Code End ---

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Verify certificate authenticity
 * @param {String} certificateId - Certificate ID to verify
 * @returns {Promise<Object>} - Certificate details if valid
 */
exports.verifyCertificate = async (certificateId) => {
  const Certificate = require('../models/Certificate');

  const certificate = await Certificate.findOne({ certificateId })
    .populate('user', 'firstName lastName email')
    .populate('internship', 'title domain');

  if (!certificate) {
    throw new Error('Certificate not found');
  }

  if (certificate.isRevoked) {
    throw new Error('Certificate has been revoked');
  }

  return certificate;
};
