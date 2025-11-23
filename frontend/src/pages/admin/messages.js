import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import apiClient from '@/utils/apiClient';
import Avatar from '@/components/ui/Avatar';
import { toast } from 'react-toastify';
import {
    FiHome, FiUsers, FiBookOpen, FiClipboard, FiFileText, FiAward,
    FiBell, FiMessageSquare, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX,
    FiSend, FiSearch, FiPlus, FiCheck, FiMoreVertical, FiArrowLeft
} from 'react-icons/fi';

// Admin Navigation Items
const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/admin/users', label: 'Users', icon: FiUsers },
    { href: '/admin/internships', label: 'Internships', icon: FiBookOpen },
    { href: '/admin/enrollments', label: 'Enrollments', icon: FiClipboard },
    { href: '/admin/submissions', label: 'Submissions', icon: FiFileText },
    { href: '/admin/certificates', label: 'Certificates', icon: FiAward },
    { href: '/admin/announcements', label: 'Announcements', icon: FiBell },
    { href: '/admin/messages', label: 'Support Chat', icon: FiMessageSquare },
    { href: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
    { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminMessages() {
    const { user, loading: authLoading, logout } = useAuth();
    const socket = useSocket();
    const router = useRouter();

    // Layout State
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Chat State
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedConversation]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            console.log('Received new_message event:', message);
            // Check both message.conversation and message.conversationId for compatibility
            const msgConvId = message.conversation || message.conversationId;

            if (selectedConversation && msgConvId === selectedConversation._id) {
                setMessages((prev) => {
                    // Avoid duplicates
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });

                // Mark as read if received from another user
                if (message.sender?._id !== user?._id) {
                    markMessageAsRead(message._id);
                }
            }
            // Always refresh conversation list to update last message
            fetchConversations();
        };

        const handleMessageRead = (data) => {
            console.log('Received message_read event:', data);
            if (selectedConversation && data.conversationId === selectedConversation._id) {
                setMessages(prev => prev.map(m => {
                    // If specific messageId provided, only update that message
                    if (data.messageId && m._id !== data.messageId) return m;

                    // Check if already marked as read by this user
                    const alreadyRead = m.readBy?.some(r => r.user === data.userId);
                    if (!alreadyRead) {
                        return {
                            ...m,
                            readBy: [...(m.readBy || []), { user: data.userId, readAt: new Date() }]
                        };
                    }
                    return m;
                }));
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('message_read', handleMessageRead);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('message_read', handleMessageRead);
        };
    }, [socket, selectedConversation, user]);

    const fetchConversations = async () => {
        try {
            const response = await apiClient.get('/conversations');
            setConversations(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await apiClient.get(`/conversations/${conversationId}/messages`);
            setMessages(response.data.data || []);
            if (socket) socket.emit('join_conversation', conversationId);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const fetchContacts = async () => {
        setLoadingContacts(true);
        try {
            const response = await apiClient.get('/users/contacts');
            setContacts(response.data.data);
        } catch (error) {
            toast.error('Failed to load contacts');
        } finally {
            setLoadingContacts(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const messageContent = newMessage.trim();
        setNewMessage(''); // Clear input immediately for better UX

        try {
            const response = await apiClient.post(`/conversations/${selectedConversation._id}/messages`, {
                content: messageContent,
            });

            const sentMessage = response.data.message;

            // Emit socket event with proper structure
            if (socket) {
                socket.emit('send_message', {
                    ...sentMessage,
                    conversationId: selectedConversation._id,
                    conversation: selectedConversation._id, // Add both for compatibility
                    sender: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar
                    }
                });
            }

            // Update local state (the socket event will also trigger, but this ensures immediate update)
            setMessages(prev => {
                // Avoid duplicates
                if (prev.some(m => m._id === sentMessage._id)) return prev;
                return [...prev, {
                    ...sentMessage,
                    sender: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar
                    }
                }];
            });

            fetchConversations();
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
            setNewMessage(messageContent); // Restore message on error
        }
    };

    const handleStartChat = async (contactId) => {
        try {
            const existing = conversations.find(c => c.participants.some(p => p._id === contactId));
            if (existing) {
                setSelectedConversation(existing);
                fetchMessages(existing._id);
                setShowNewChatModal(false);
                return;
            }

            const response = await apiClient.post('/conversations', { participants: [contactId] });
            const newConv = response.data.data;
            setConversations([newConv, ...conversations]);
            setSelectedConversation(newConv);
            setMessages([]);
            setShowNewChatModal(false);
            if (socket) socket.emit('join_conversation', newConv._id);
        } catch (error) {
            toast.error('Failed to start conversation');
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const otherUser = conv.participants?.find(p => p._id !== user?._id);
        const search = searchTerm.toLowerCase();
        return otherUser?.firstName?.toLowerCase().includes(search) || otherUser?.lastName?.toLowerCase().includes(search);
    });

    const filterContacts = (list) => {
        if (!list) return [];
        const search = contactSearch.toLowerCase();
        return list.filter(c => c._id !== user?._id && (
            c.firstName?.toLowerCase().includes(search) ||
            c.lastName?.toLowerCase().includes(search) ||
            c.email?.toLowerCase().includes(search)
        ));
    };

    const getMessageStatus = (message) => {
        if (message.sender._id !== user._id) return null;
        const otherParticipants = selectedConversation?.participants.filter(p => p._id !== user._id);
        const isRead = otherParticipants?.every(p => message.readBy?.some(r => r.user === p._id));
        return isRead ? (
            <div className="flex items-center gap-0.5">
                <FiCheck className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                <FiCheck className="w-3.5 h-3.5 text-blue-500 -ml-2" strokeWidth={3} />
            </div>
        ) : <FiCheck className="w-3.5 h-3.5 text-gray-400" strokeWidth={2.5} />;
    };

    const formatTime = (date) => {
        const d = new Date(date);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (authLoading || loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <>
            <Head><title>Support Chat - Admin</title></Head>

            {/* Main Layout Container - H-SCREEN & OVERFLOW-HIDDEN to prevent body scroll */}
            <div className="flex h-screen overflow-hidden bg-gray-50">

                {/* Admin Sidebar (Desktop) */}
                <aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-white border-r border-slate-800 z-20">
                    <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                            <span className="font-bold text-white text-xl">A</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight">Admin Portal</h1>
                            <p className="text-xs text-slate-400">Manage your platform</p>
                        </div>
                    </div>
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map(item => (
                            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${router.pathname === item.href ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                <item.icon className="w-5 h-5" /> {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-slate-800">
                        <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                            <FiLogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                        <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 text-white shadow-2xl flex flex-col animate-slide-in-left">
                            <div className="flex items-center justify-between p-6 border-b border-slate-800">
                                <span className="font-bold text-lg">Admin Portal</span>
                                <button onClick={() => setSidebarOpen(false)}><FiX className="w-6 h-6 text-slate-400" /></button>
                            </div>
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {navItems.map(item => (
                                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${router.pathname === item.href ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                                        <item.icon className="w-5 h-5" /> {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">

                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600"><FiMenu className="w-6 h-6" /></button>
                            <span className="font-bold text-gray-900">Support Chat</span>
                        </div>
                        <Avatar name={`${user?.firstName} ${user?.lastName}`} size="sm" />
                    </div>

                    {/* Chat Layout: Sidebar + Message Area */}
                    <div className="flex-1 flex overflow-hidden">

                        {/* Conversation List Sidebar */}
                        <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} w-full lg:w-96 flex-col border-r border-gray-200 bg-gray-50 h-full`}>
                            {/* Search & Header */}
                            <div className="p-4 bg-white border-b border-gray-200 shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 hidden lg:block">Messages</h2>
                                    <h2 className="text-xl font-bold text-gray-900 lg:hidden">Chats</h2>
                                    <button onClick={() => { setShowNewChatModal(true); fetchContacts(); }} className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                                        <FiPlus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredConversations.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {filteredConversations.map(conv => {
                                            const other = conv.participants?.find(p => p._id !== user?._id);
                                            return (
                                                <button
                                                    key={conv._id}
                                                    onClick={() => { setSelectedConversation(conv); fetchMessages(conv._id); }}
                                                    className={`w-full p-4 text-left hover:bg-white transition-colors flex items-start gap-3 ${selectedConversation?._id === conv._id ? 'bg-white border-l-4 border-primary-600' : 'border-l-4 border-transparent'}`}
                                                >
                                                    <Avatar name={`${other?.firstName} ${other?.lastName}`} size="md" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="font-semibold text-gray-900 truncate">{other?.firstName} {other?.lastName}</span>
                                                            {conv.lastMessageAt && <span className="text-xs text-gray-500">{formatTime(conv.lastMessageAt)}</span>}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded uppercase font-bold tracking-wide">{other?.role}</span>
                                                            <p className="text-sm text-gray-500 truncate flex-1">{conv.lastMessage?.content || 'New conversation'}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <FiMessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>No conversations yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Message Area */}
                        <div className={`${!selectedConversation ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-white h-full relative`}>
                            {selectedConversation ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-3 lg:p-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 z-10">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setSelectedConversation(null)} className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                                                <FiArrowLeft className="w-5 h-5" />
                                            </button>
                                            {(() => {
                                                const other = selectedConversation.participants?.find(p => p._id !== user?._id);
                                                return (
                                                    <div className="flex items-center gap-3">
                                                        <Avatar name={`${other?.firstName} ${other?.lastName}`} size="sm" />
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{other?.firstName} {other?.lastName}</h3>
                                                            <p className="text-xs text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online</p>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600"><FiMoreVertical className="w-5 h-5" /></button>
                                    </div>

                                    {/* Messages List */}
                                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                        {messages.map((msg, i) => {
                                            const isOwn = msg.sender?._id === user?._id;
                                            const showDate = i === 0 || new Date(messages[i - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
                                            return (
                                                <div key={msg._id}>
                                                    {showDate && (
                                                        <div className="flex justify-center my-4">
                                                            <span className="bg-white/80 backdrop-blur text-xs text-gray-500 px-3 py-1 rounded-full shadow-sm border border-gray-100">{formatTime(msg.createdAt)}</span>
                                                        </div>
                                                    )}
                                                    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[85%] lg:max-w-[65%] rounded-2xl px-4 py-2 shadow-sm ${isOwn ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'}`}>
                                                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                                                            <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
                                                                <span className="text-[10px]">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                {isOwn && getMessageStatus(msg)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-3 lg:p-4 bg-white border-t border-gray-200 shrink-0">
                                        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                            <textarea
                                                value={newMessage}
                                                onChange={e => setNewMessage(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                                                placeholder="Type a message..."
                                                className="flex-1 bg-gray-100 border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 resize-none max-h-32"
                                                rows="1"
                                            />
                                            <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">
                                                <FiSend className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50/50">
                                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                        <FiMessageSquare className="w-10 h-10 text-primary-200" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-600">Select a conversation</p>
                                    <p className="text-sm">Choose a contact to start chatting</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* New Chat Modal */}
                {showNewChatModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNewChatModal(false)} />
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-scale-in">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg">New Message</h3>
                                <button onClick={() => setShowNewChatModal(false)} className="p-1 hover:bg-gray-200 rounded-full"><FiX className="w-5 h-5" /></button>
                            </div>
                            <div className="p-3 border-b border-gray-100">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search users..."
                                        value={contactSearch}
                                        onChange={e => setContactSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2">
                                {loadingContacts ? (
                                    <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
                                ) : (
                                    <div className="space-y-4 p-2">
                                        {['admins', 'mentors', 'interns'].map(role => {
                                            const list = filterContacts(contacts[role]);
                                            if (!list?.length) return null;
                                            return (
                                                <div key={role}>
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">{role}</h4>
                                                    <div className="space-y-1">
                                                        {list.map(c => (
                                                            <button key={c._id} onClick={() => handleStartChat(c._id)} className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                                                <Avatar name={`${c.firstName} ${c.lastName}`} size="sm" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                                                                    <p className="text-xs text-gray-500">{c.email}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {Object.values(contacts).every(l => filterContacts(l).length === 0) && (
                                            <p className="text-center text-gray-500 py-4 text-sm">No users found</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
