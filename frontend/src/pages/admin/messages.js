import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import Avatar from '@/components/ui/Avatar';
import apiClient from '@/utils/apiClient';
import { FiSend, FiSearch, FiUser, FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AdminMessages() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // New Chat Modal State
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [contacts, setContacts] = useState({ admins: [], mentors: [], interns: [] });
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [contactSearch, setContactSearch] = useState('');

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                router.push('/');
            } else {
                fetchConversations();
            }
        }
    }, [user, authLoading]);

    const fetchConversations = async () => {
        try {
            const response = await apiClient.get('/conversations');
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
            const response = await apiClient.get(`/conversations/${conversationId}/messages`);
            setMessages(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            setMessages([]);
        }
    };

    const fetchContacts = async () => {
        setLoadingContacts(true);
        try {
            const response = await apiClient.get('/users/contacts');
            setContacts(response.data.data);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            toast.error('Failed to load contacts');
        } finally {
            setLoadingContacts(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            await apiClient.post(`/conversations/${selectedConversation._id}/messages`, {
                content: newMessage,
            });
            setNewMessage('');
            fetchMessages(selectedConversation._id);
            // Refresh conversations to update last message
            fetchConversations();
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        }
    };

    const handleStartChat = async (contactId) => {
        try {
            // Check if conversation already exists
            const existing = conversations.find(c =>
                c.participants.some(p => p._id === contactId)
            );

            if (existing) {
                setSelectedConversation(existing);
                fetchMessages(existing._id);
                setShowNewChatModal(false);
                return;
            }

            // Create new conversation
            const response = await apiClient.post('/conversations', {
                participants: [contactId]
            });

            const newConv = response.data.data;
            setConversations([newConv, ...conversations]);
            setSelectedConversation(newConv);
            setMessages([]); // Empty for new chat
            setShowNewChatModal(false);
        } catch (error) {
            console.error('Failed to start chat:', error);
            toast.error('Failed to start conversation');
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const otherUser = conv.participants?.find(p => p._id !== user?._id);
        const search = searchTerm.toLowerCase();
        return otherUser?.firstName?.toLowerCase().includes(search) ||
            otherUser?.lastName?.toLowerCase().includes(search);
    });

    const filterContacts = (list) => {
        if (!list) return [];
        const search = contactSearch.toLowerCase();
        return list.filter(c =>
            c._id !== user?._id && // Exclude self
            (c.firstName?.toLowerCase().includes(search) ||
                c.lastName?.toLowerCase().includes(search) ||
                c.email?.toLowerCase().includes(search))
        );
    };

    if (authLoading || loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <>
            <Head>
                <title>Support Chat - Admin Dashboard</title>
            </Head>

            <AdminLayout>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-[calc(100vh-140px)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                        {/* Conversations List */}
                        <div className={`border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                            <div className="p-3 border-b border-gray-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-bold text-gray-900">Support Chat</h2>
                                    <button
                                        onClick={() => {
                                            setShowNewChatModal(true);
                                            fetchContacts();
                                        }}
                                        className="p-2 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors"
                                        title="New Chat"
                                    >
                                        <FiPlus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                                                className={`w-full p-3 border-b border-gray-100 hover:bg-gray-50 text-left transition-colors ${selectedConversation?._id === conversation._id ? 'bg-primary-50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={`${otherUser?.firstName} ${otherUser?.lastName}`} size="sm" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-baseline">
                                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                                {otherUser?.firstName} {otherUser?.lastName}
                                                            </h3>
                                                            {conversation.lastMessageAt && (
                                                                <span className="text-xs text-gray-400">
                                                                    {new Date(conversation.lastMessageAt).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {conversation.lastMessage?.content || 'No messages yet'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        No conversations found. Start a new chat!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className={`col-span-2 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                            {selectedConversation ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-3 border-b border-gray-200 flex items-center gap-3 bg-white">
                                        <button
                                            className="md:hidden mr-2 text-gray-500"
                                            onClick={() => setSelectedConversation(null)}
                                        >
                                            <FiX className="w-5 h-5" />
                                        </button>
                                        {(() => {
                                            const otherUser = selectedConversation.participants?.find(p => p._id !== user?._id);
                                            return (
                                                <>
                                                    <Avatar name={`${otherUser?.firstName} ${otherUser?.lastName}`} size="sm" />
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900">
                                                            {otherUser?.firstName} {otherUser?.lastName}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 capitalize">{otherUser?.role}</p>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                        {messages.map((message) => {
                                            const isOwn = message.sender?._id === user?._id;
                                            return (
                                                <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] lg:max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${isOwn
                                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                                        : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                                                        }`}>
                                                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                                        <p className={`text-[10px] mt-1 text-right ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
                                                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {messages.length === 0 && (
                                            <div className="text-center text-gray-400 text-sm mt-10">
                                                Start the conversation by sending a message.
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Input */}
                                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim()}
                                                className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FiSend className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <FiUser className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Support Chat</h3>
                                        <p className="text-sm mt-1">Select a conversation or start a new chat</p>
                                        <button
                                            onClick={() => {
                                                setShowNewChatModal(true);
                                                fetchContacts();
                                            }}
                                            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
                                        >
                                            Start New Chat
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* New Chat Modal */}
                {showNewChatModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">New Chat</h3>
                                <button
                                    onClick={() => setShowNewChatModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-3 border-b border-gray-100">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={contactSearch}
                                        onChange={(e) => setContactSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {loadingContacts ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Admins Section */}
                                        {filterContacts(contacts.admins).length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Admins</h4>
                                                <div className="space-y-2">
                                                    {filterContacts(contacts.admins).map(admin => (
                                                        <button
                                                            key={admin._id}
                                                            onClick={() => handleStartChat(admin._id)}
                                                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                        >
                                                            <Avatar name={`${admin.firstName} ${admin.lastName}`} size="sm" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{admin.firstName} {admin.lastName}</p>
                                                                <p className="text-xs text-gray-500">{admin.email}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Mentors Section */}
                                        {filterContacts(contacts.mentors).length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Mentors</h4>
                                                <div className="space-y-2">
                                                    {filterContacts(contacts.mentors).map(mentor => (
                                                        <button
                                                            key={mentor._id}
                                                            onClick={() => handleStartChat(mentor._id)}
                                                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                        >
                                                            <Avatar name={`${mentor.firstName} ${mentor.lastName}`} size="sm" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{mentor.firstName} {mentor.lastName}</p>
                                                                <p className="text-xs text-gray-500">{mentor.email}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Interns Section */}
                                        {filterContacts(contacts.interns).length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Interns</h4>
                                                <div className="space-y-2">
                                                    {filterContacts(contacts.interns).map(intern => (
                                                        <button
                                                            key={intern._id}
                                                            onClick={() => handleStartChat(intern._id)}
                                                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                        >
                                                            <Avatar name={`${intern.firstName} ${intern.lastName}`} size="sm" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{intern.firstName} {intern.lastName}</p>
                                                                <p className="text-xs text-gray-500">{intern.email}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {filterContacts(contacts.admins).length === 0 &&
                                            filterContacts(contacts.mentors).length === 0 &&
                                            filterContacts(contacts.interns).length === 0 && (
                                                <div className="text-center text-gray-500 py-4">
                                                    No contacts found.
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}
