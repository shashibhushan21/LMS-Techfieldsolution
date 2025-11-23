/**
 * Socket.IO Service
 * Industry-standard implementation with event management, reconnection logic, and error handling
 */

import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Initialize socket connection
   * @param {string} userId - User ID to join personal room
   */
  connect(userId) {
    if (this.socket?.connected) {
      console.log('[Socket] Already connected');
      return this.socket;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 20000,
      autoConnect: true,
    });

    this._setupDefaultListeners(userId);
    
    return this.socket;
  }

  /**
   * Setup default socket event listeners
   * @param {string} userId - User ID
   * @private
   */
  _setupDefaultListeners(userId) {
    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Emit join event with userId
      if (userId) {
        this.socket.emit('join', userId);
        console.log('[Socket] User joined room:', userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, reconnect manually
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[Socket] Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('[Socket] Reconnection attempt:', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('[Socket] Reconnection error:', error.message);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[Socket] Reconnection failed');
    });
  }

  /**
   * Join a conversation room
   * @param {string} conversationId - Conversation ID
   */
  joinConversation(conversationId) {
    if (!this.socket) {
      console.error('[Socket] Socket not initialized');
      return;
    }
    
    this.socket.emit('join_conversation', conversationId);
    console.log('[Socket] Joined conversation:', conversationId);
  }

  /**
   * Leave a conversation room
   * @param {string} conversationId - Conversation ID
   */
  leaveConversation(conversationId) {
    if (!this.socket) {
      console.error('[Socket] Socket not initialized');
      return;
    }
    
    this.socket.emit('leave_conversation', conversationId);
    console.log('[Socket] Left conversation:', conversationId);
  }

  /**
   * Send a message via socket
   * @param {Object} messageData - Message data
   */
  sendMessage(messageData) {
    if (!this.socket) {
      console.error('[Socket] Socket not initialized');
      return;
    }
    
    this.socket.emit('send_message', messageData);
    console.log('[Socket] Message sent:', messageData);
  }

  /**
   * Mark message as read
   * @param {Object} readData - Read receipt data
   */
  markAsRead(readData) {
    if (!this.socket) {
      console.error('[Socket] Socket not initialized');
      return;
    }
    
    this.socket.emit('mark_read', readData);
    console.log('[Socket] Marked as read:', readData);
  }

  /**
   * Register event handler
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  on(event, handler) {
    if (!this.socket) {
      console.error('[Socket] Socket not initialized');
      return;
    }

    // Store handler reference for cleanup
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
    
    this.socket.on(event, handler);
    console.log(`[Socket] Registered handler for event: ${event}`);
  }

  /**
   * Remove event handler
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function (optional)
   */
  off(event, handler) {
    if (!this.socket) {
      console.error('[Socket] Socket not initialized');
      return;
    }

    if (handler) {
      this.socket.off(event, handler);
      
      // Remove from stored handlers
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    } else {
      // Remove all handlers for this event
      this.socket.off(event);
      this.eventHandlers.delete(event);
    }
    
    console.log(`[Socket] Removed handler for event: ${event}`);
  }

  /**
   * Emit a custom event
   * @param {string} event - Event name
   * @param {*} data - Data to emit
   */
  emit(event, data) {
    if (!this.socket) {
      console.error('[Socket] Socket not initialized');
      return;
    }
    
    this.socket.emit(event, data);
    console.log(`[Socket] Emitted event: ${event}`, data);
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      // Remove all custom event handlers
      this.eventHandlers.forEach((handlers, event) => {
        handlers.forEach(handler => {
          this.socket.off(event, handler);
        });
      });
      this.eventHandlers.clear();
      
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('[Socket] Disconnected and cleaned up');
    }
  }

  /**
   * Check if socket is connected
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected && this.socket?.connected;
  }

  /**
   * Get socket instance
   * @returns {Socket|null}
   */
  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
