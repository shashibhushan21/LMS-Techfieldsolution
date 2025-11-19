import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Avatar from '@/components/ui/Avatar';
import apiClient from '@/utils/apiClient';
import { FiSend, FiSearch, FiUser } from 'react-icons/fi';

export default function Messages() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchConversations();
      }
    }
  }, [user, authLoading]);

  const fetchConversations = async () => {
    try {
      const response = await apiClient.get('/messages/conversations');
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await apiClient.get(`/messages/conversation/${conversationId}`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await apiClient.post('/messages', {
        conversationId: selectedConversation._id,
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages(selectedConversation._id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants?.find(p => p._id !== user?._id);
    const search = searchTerm.toLowerCase();
    return otherUser?.firstName?.toLowerCase().includes(search) ||
           otherUser?.lastName?.toLowerCase().includes(search);
  });

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Messages - Dashboard</title>
      </Head>

      <DashboardLayout>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversations List */}
            <div className="border-r border-gray-200 flex flex-col">
              <div className="p-3 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-2">Messages</h2>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    const otherUser = conversation.participants?.find(p => p._id !== user?._id);
                    return (
                      <button
                        key={conversation._id}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          fetchMessages(conversation._id);
                        }}
                        className={`w-full p-3 border-b border-gray-100 hover:bg-gray-50 text-left transition-colors ${
                          selectedConversation?._id === conversation._id ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar name={`${otherUser?.firstName} ${otherUser?.lastName}`} size="sm" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {otherUser?.firstName} {otherUser?.lastName}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">{conversation.lastMessage?.content || 'No messages yet'}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No conversations found
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b border-gray-200 flex items-center gap-3">
                    {(() => {
                      const otherUser = selectedConversation.participants?.find(p => p._id !== user?._id);
                      return (
                        <>
                          <Avatar name={`${otherUser?.firstName} ${otherUser?.lastName}`} size="sm" />
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {otherUser?.firstName} {otherUser?.lastName}
                            </h3>
                            <p className="text-xs text-gray-500">{otherUser?.role}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => {
                      const isOwn = message.sender?._id === user?._id;
                      return (
                        <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                            isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="btn btn-primary px-4"
                      >
                        <FiSend className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FiUser className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
