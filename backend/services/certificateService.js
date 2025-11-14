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

      // Add border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

      // Title
      doc.fontSize(40)
        .font('Helvetica-Bold')
        .fillColor('#1a237e')
        .text('Certificate of Completion', 0, 100, { align: 'center' });

      // Subtitle
      doc.fontSize(16)
        .font('Helvetica')
        .fillColor('#000000')
        .text('This is to certify that', 0, 180, { align: 'center' });

      // Intern name
      doc.fontSize(32)
        .font('Helvetica-Bold')
        .fillColor('#2196f3')
        .text(internName, 0, 220, { align: 'center' });

      // Description
      doc.fontSize(16)
        .font('Helvetica')
        .fillColor('#000000')
        .text('has successfully completed the internship program', 0, 280, { align: 'center' });

      // Internship title
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#1a237e')
        .text(internshipTitle, 0, 320, { align: 'center' });

      // Skills
      if (skills && skills.length > 0) {
        doc.fontSize(12)
          .font('Helvetica')
          .fillColor('#666666')
          .text(`Skills: ${skills.join(', ')}`, 0, 370, { align: 'center' });
      }

      // Score
      if (score) {
        doc.fontSize(14)
          .font('Helvetica-Bold')
          .fillColor('#4caf50')
          .text(`Final Score: ${score}%`, 0, 400, { align: 'center' });
      }

      // Date
      doc.fontSize(14)
        .font('Helvetica')
        .fillColor('#000000')
        .text(`Completion Date: ${new Date(completionDate).toLocaleDateString()}`, 0, 440, { align: 'center' });

      // Certificate ID
      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#999999')
        .text(`Certificate ID: ${certificateId}`, 0, 480, { align: 'center' });

      // Footer
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#1a237e')
        .text('TechFieldSolution', 100, doc.page.height - 100);

      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#666666')
        .text('www.techfieldsolution.com', 100, doc.page.height - 80);

      // Signature line
      doc.moveTo(doc.page.width - 300, doc.page.height - 100)
        .lineTo(doc.page.width - 100, doc.page.height - 100)
        .stroke();
      
      doc.fontSize(10)
        .text('Authorized Signature', doc.page.width - 300, doc.page.height - 80, {
          width: 200,
          align: 'center'
        });

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
    .populate('intern', 'firstName lastName email')
    .populate('internship', 'title domain');

  if (!certificate) {
    throw new Error('Certificate not found');
  }

  if (certificate.isRevoked) {
    throw new Error('Certificate has been revoked');
  }

  return certificate;
};
