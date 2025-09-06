"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Video,
  Send,
  Smile,
  Paperclip,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MoreVertical,
  ArrowLeft,
  Search,
  Image,
  Volume2,
  Plus,
  Settings,
  Bell,
  Users,
  Globe,
  Wifi,
  WifiOff,
  Clock,
  CheckCheck,
  Check,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: Date;
  country: string;
  timeZone: string;
  isTyping?: boolean;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  type: "text" | "audio" | "image" | "file";
  status: "sending" | "sent" | "delivered" | "read";
  duration?: number;
  fileName?: string;
}

interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

const NepChatDashboard: React.FC = () => {
  // Current user (you)
  const currentUser: User = {
    id: "user1",
    name: "राम बहादुर",
    avatar: "👨‍💻",
    status: "online",
    country: "Nepal",
    timeZone: "Asia/Kathmandu",
  };

  // Contact profiles from different countries
  const [contacts] = useState<User[]>([
    {
      id: "user2",
      name: "सुनिता शर्मा",
      avatar: "👩‍💼",
      status: "online",
      country: "Nepal",
      timeZone: "Asia/Kathmandu",
    },
    {
      id: "user3",
      name: "John Smith",
      avatar: "👨‍🚀",
      status: "away",
      lastSeen: new Date(Date.now() - 1800000),
      country: "USA",
      timeZone: "America/New_York",
    },
    {
      id: "user4",
      name: "Yuki Tanaka",
      avatar: "👩‍🎨",
      status: "online",
      country: "Japan",
      timeZone: "Asia/Tokyo",
    },
    {
      id: "user5",
      name: "Sarah Johnson",
      avatar: "👩‍⚕️",
      status: "offline",
      lastSeen: new Date(Date.now() - 7200000),
      country: "UK",
      timeZone: "Europe/London",
    },
    {
      id: "user6",
      name: "अमित पौडेल",
      avatar: "👨‍🏫",
      status: "online",
      country: "Australia",
      timeZone: "Australia/Sydney",
    },
  ]);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    { id: "room1", participants: ["user1", "user2"], unreadCount: 2 },
    { id: "room2", participants: ["user1", "user3"], unreadCount: 0 },
    { id: "room3", participants: ["user1", "user4"], unreadCount: 1 },
    { id: "room4", participants: ["user1", "user5"], unreadCount: 0 },
    { id: "room5", participants: ["user1", "user6"], unreadCount: 3 },
  ]);

  const [messages, setMessages] = useState<{ [chatRoomId: string]: Message[] }>(
    {
      room1: [
        {
          id: "msg1",
          text: "नमस्ते! How are you doing?",
          senderId: "user2",
          receiverId: "user1",
          timestamp: new Date(Date.now() - 3600000),
          type: "text",
          status: "read",
        },
        {
          id: "msg2",
          text: "Hi! I'm doing great, thanks for asking! 😊",
          senderId: "user1",
          receiverId: "user2",
          timestamp: new Date(Date.now() - 3500000),
          type: "text",
          status: "read",
        },
      ],
      room3: [
        {
          id: "msg3",
          text: "こんにちは! Ready for our video call?",
          senderId: "user4",
          receiverId: "user1",
          timestamp: new Date(Date.now() - 1800000),
          type: "text",
          status: "delivered",
        },
      ],
    }
  );

  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(
    "room1"
  );
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [currentView, setCurrentView] = useState<"dashboard" | "chat" | "call">(
    "dashboard"
  );
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const emojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "🙏",
    "😍",
    "😢",
    "😮",
    "🎉",
    "🔥",
    "🇳🇵",
    "🌍",
  ];

  // Simulate network connectivity
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChatRoom]);

  // Simulate typing indicators
  useEffect(() => {
    if (selectedChatRoom) {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          const otherUserId = chatRooms
            .find((room) => room.id === selectedChatRoom)
            ?.participants.find((id) => id !== currentUser.id);
          if (otherUserId) {
            setTypingUsers((prev) => new Set([...prev, otherUserId]));
            setTimeout(() => {
              setTypingUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(otherUserId);
                return newSet;
              });
            }, 3000);
          }
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedChatRoom, chatRooms, currentUser.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getContactFromChatRoom = (chatRoomId: string): User | undefined => {
    const room = chatRooms.find((r) => r.id === chatRoomId);
    if (!room) return undefined;
    const contactId = room.participants.find((id) => id !== currentUser.id);
    return contacts.find((c) => c.id === contactId);
  };

  const getLocalTime = (timeZone: string) => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    });
  };

  const getTimeDifference = (timeZone: string) => {
    const now = new Date();
    const localTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })
    );
    const remoteTime = new Date(now.toLocaleString("en-US", { timeZone }));
    const diff =
      (remoteTime.getTime() - localTime.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? `+${diff}h` : `${diff}h`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChatRoom && isConnected) {
      const contact = getContactFromChatRoom(selectedChatRoom);
      if (!contact) return;

      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        senderId: currentUser.id,
        receiverId: contact.id,
        timestamp: new Date(),
        type: "text",
        status: "sending",
      };

      setMessages((prev) => ({
        ...prev,
        [selectedChatRoom]: [...(prev[selectedChatRoom] || []), message],
      }));

      setNewMessage("");

      // Simulate message delivery
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [selectedChatRoom]: prev[selectedChatRoom].map((msg) =>
            msg.id === message.id ? { ...msg, status: "sent" } : msg
          ),
        }));
      }, 1000);

      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [selectedChatRoom]: prev[selectedChatRoom].map((msg) =>
            msg.id === message.id ? { ...msg, status: "delivered" } : msg
          ),
        }));
      }, 2000);

      // Simulate auto-reply from contact
      if (contact.status === "online") {
        setTimeout(() => {
          const replies = [
            "That's interesting!",
            "I see what you mean 😊",
            "धन्यवाद for sharing!",
            "Great point!",
            "こんにちは from Japan!",
            "Lovely to hear from you!",
          ];
          const reply: Message = {
            id: (Date.now() + 1).toString(),
            text: replies[Math.floor(Math.random() * replies.length)],
            senderId: contact.id,
            receiverId: currentUser.id,
            timestamp: new Date(),
            type: "text",
            status: "sent",
          };
          setMessages((prev) => ({
            ...prev,
            [selectedChatRoom]: [...(prev[selectedChatRoom] || []), reply],
          }));

          // Mark as read after a moment
          setTimeout(() => {
            setMessages((prev) => ({
              ...prev,
              [selectedChatRoom]: prev[selectedChatRoom].map((msg) =>
                msg.id === message.id ? { ...msg, status: "read" } : msg
              ),
            }));
          }, 3000);
        }, 3000 + Math.random() * 2000);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const startCall = (type: "audio" | "video") => {
    if (!isConnected) return;
    setCallType(type);
    setIsCallActive(true);
    setCurrentView("call");
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallType(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setCurrentView("chat");
  };

  const formatMessageStatus = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400" />;
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  // Dashboard View
  if (currentView === "dashboard") {
    return (
      <div className="h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-orange-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-lg">
                {currentUser.avatar}
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-700">NepChat</h2>
                <div className="flex items-center space-x-2 text-sm">
                  {isConnected ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-500" />
                      <span className="text-red-600">Offline</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Contacts Sidebar */}
          <div className="w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200/50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Conversations</h3>
                <button className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {chatRooms.map((room) => {
                  const contact = getContactFromChatRoom(room.id);
                  if (!contact) return null;

                  return (
                    <div
                      key={room.id}
                      onClick={() => {
                        setSelectedChatRoom(room.id);
                        setCurrentView("chat");
                      }}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/70 cursor-pointer transition-all duration-200"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-lg">
                          {contact.avatar}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            contact.status === "online"
                              ? "bg-green-500"
                              : contact.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-700 truncate">
                            {contact.name}
                          </h4>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Globe className="w-3 h-3" />
                            <span>{contact.country}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <p className="text-gray-500 truncate">
                            {contact.status === "online"
                              ? `${getLocalTime(
                                  contact.timeZone
                                )} (${getTimeDifference(contact.timeZone)})`
                              : contact.lastSeen
                              ? `Last seen ${contact.lastSeen.toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}`
                              : "Offline"}
                          </p>
                          {room.unreadCount > 0 && (
                            <div className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {room.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                💬
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Welcome to NepChat
              </h2>
              <p className="text-gray-600 mb-6">
                Connect with friends and family around the world. Select a
                conversation to start chatting!
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {contacts.filter((c) => c.status === "online").length}{" "}
                    online
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>
                    {new Set(contacts.map((c) => c.country)).size} countries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Call View
  if (currentView === "call" && isCallActive) {
    const contact = getContactFromChatRoom(selectedChatRoom!);
    if (!contact) return null;

    return (
      <div className="h-screen bg-gradient-to-br from-emerald-100 via-blue-100 to-orange-100 flex flex-col">
        {/* Call Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={endCall}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h3 className="font-semibold text-gray-700">{contact.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-emerald-600">
                  <Globe className="w-3 h-3" />
                  <span>
                    {contact.country} • {getLocalTime(contact.timeZone)}
                  </span>
                  <span>
                    • {callType === "video" ? "Video Call" : "Voice Call"} •
                    02:14
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {callType === "video" ? (
            <div className="relative w-full max-w-4xl">
              {/* Main Video */}
              <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden mb-4">
                <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-blue-200 flex items-center justify-center">
                  <div className="text-8xl">{contact.avatar}</div>
                </div>
              </div>
              {/* Self Video */}
              <div className="absolute top-4 right-4 w-40 h-30 bg-gray-800 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                  <div className="text-3xl">{currentUser.avatar}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-40 h-40 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-6xl text-white mb-6 animate-pulse">
                {contact.avatar}
              </div>
              <h2 className="text-3xl font-semibold text-gray-700 mb-2">
                {contact.name}
              </h2>
              <div className="flex items-center justify-center space-x-2 text-emerald-600 mb-4">
                <Globe className="w-4 h-4" />
                <span>
                  {contact.country} • {getLocalTime(contact.timeZone)} (
                  {getTimeDifference(contact.timeZone)})
                </span>
              </div>
              <p className="text-gray-600">Audio call in progress...</p>
            </div>
          )}

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-6 mt-8">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-all duration-200 ${
                isMuted
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            {callType === "video" && (
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-4 rounded-full transition-all duration-200 ${
                  isVideoOff
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isVideoOff ? (
                  <VideoOff className="w-6 h-6" />
                ) : (
                  <Video className="w-6 h-6" />
                )}
              </button>
            )}

            <button
              onClick={endCall}
              className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chat View
  const contact = getContactFromChatRoom(selectedChatRoom!);
  if (!contact) return <div>Contact not found</div>;

  const chatMessages = messages[selectedChatRoom!] || [];

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-orange-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-lg">
                {contact.avatar}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  contact.status === "online"
                    ? "bg-green-500"
                    : contact.status === "away"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              ></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">{contact.name}</h3>
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="w-3 h-3 text-gray-500" />
                <span className="text-gray-500">{contact.country}</span>
                {contact.status === "online" && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-emerald-600">
                      {getLocalTime(contact.timeZone)} (
                      {getTimeDifference(contact.timeZone)})
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => startCall("audio")}
              disabled={!isConnected}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors disabled:opacity-50"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => startCall("video")}
              disabled={!isConnected}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
            >
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-red-100 border-b border-red-200 p-2 text-center text-red-700 text-sm">
          <WifiOff className="w-4 h-4 inline mr-2" />
          Connection lost. Messages will be sent when reconnected.
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUser.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.senderId === currentUser.id
                  ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200/50"
              }`}
            >
              {message.type === "audio" ? (
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div className="bg-white/50 h-full rounded-full w-3/4"></div>
                  </div>
                  <span className="text-xs">{message.duration}s</span>
                </div>
              ) : (
                <p className="text-sm">{message.text}</p>
              )}
              <div
                className={`flex items-center justify-between mt-1 text-xs ${
                  message.senderId === currentUser.id
                    ? "text-white/70"
                    : "text-gray-500"
                }`}
              >
                <span>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.senderId === currentUser.id && (
                  <div className="ml-2">
                    {formatMessageStatus(message.status)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicators */}
        {Array.from(typingUsers).map((userId) => {
          const typingUser = contacts.find((c) => c.id === userId);
          if (!typingUser) return null;

          return (
            <div key={userId} className="flex justify-start">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-200/50">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">
                    {typingUser.name} is typing
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-4">
          <div className="grid grid-cols-12 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <div
              className={`flex items-center bg-white rounded-2xl border px-4 py-2 ${
                isConnected ? "border-gray-200/50" : "border-red-200 bg-red-50"
              }`}
            >
              <input
                ref={messageInputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isConnected
                    ? "Type a message..."
                    : "Waiting for connection..."
                }
                disabled={!isConnected}
                className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-500 disabled:placeholder-gray-400"
              />

              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={!isConnected}
                  className="p-1 text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  disabled={!isConnected}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  disabled={!isConnected}
                  className="p-1 text-gray-500 hover:text-orange-600 transition-colors disabled:opacity-50"
                >
                  <Image className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {newMessage.trim() ? (
            <button
              onClick={handleSendMessage}
              disabled={!isConnected}
              className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full hover:from-emerald-400 hover:to-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              disabled={!isConnected}
              className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full hover:from-emerald-400 hover:to-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Connection Status in Input Area */}
        {!isConnected && (
          <div className="flex items-center justify-center mt-2 text-xs text-red-600">
            <WifiOff className="w-3 h-3 mr-1" />
            <span>Reconnecting...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NepChatDashboard;
