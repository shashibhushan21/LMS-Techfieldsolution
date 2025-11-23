import { createContext, useContext, useEffect, useState } from 'react';
import socketService from '@/services/socketService';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect using socketService
      const userId = user._id || user.id;
      const socketInstance = socketService.connect(userId);
      setSocket(socketInstance);

      return () => {
        // Cleanup is handled by socketService
        // socketService.disconnect(); // Don't disconnect immediately, allow reuse
      };
    } else {
      // Disconnect socket if user logs out
      if (socket) {
        socketService.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
