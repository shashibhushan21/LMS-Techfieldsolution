const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage
} = require('../controllers/conversationController');
const { protect } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

router.get('/', protect, getConversations);
router.post('/', protect, createConversation);
router.get('/:id', protect, getConversation);
router.post('/:id/messages', protect, upload.array('attachments', 3), handleMulterError, sendMessage);
router.get('/:id/messages', protect, getMessages);
router.put('/messages/:messageId/read', protect, markAsRead);
router.delete('/messages/:messageId', protect, deleteMessage);

module.exports = router;
