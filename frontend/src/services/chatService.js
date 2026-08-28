import api from './api';

// Initial preloaded merchant conversations
export const INITIAL_MERCHANT_CHATS = [
  {
    id: 'chat_merchant_1',
    name: 'Sri Lakshmi Modern Rice Mill',
    role: 'Rice Miller & Exporter',
    avatar: '🌾',
    location: 'Thanjavur, Tamil Nadu',
    phone: '9842109876',
    online: true,
    lastMessage: 'We are buying BPT-5204 Paddy @ ₹2,550/Qtl. How many bags do you have?',
    lastTime: '10:42 AM',
    unread: 2,
    messages: [
      {
        id: 'm1',
        sender: 'merchant',
        text: 'வணக்கம்! We are actively procuring Paddy (Ponni & BPT-5204) this week.',
        time: '10:30 AM',
      },
      {
        id: 'm2',
        sender: 'merchant',
        text: 'We are offering ₹2,550/Quintal with instant weighbridge cash/RTGS payment.',
        time: '10:31 AM',
      },
      {
        id: 'm3',
        sender: 'farmer',
        text: 'I have around 150 bags of harvest ready in Thanjavur district.',
        time: '10:38 AM',
      },
      {
        id: 'm4',
        sender: 'merchant',
        text: 'We are buying BPT-5204 Paddy @ ₹2,550/Qtl. How many bags do you have?',
        time: '10:42 AM',
      }
    ]
  },
  {
    id: 'chat_merchant_2',
    name: 'Guntur Spice Traders & Exporters',
    role: 'Chilli & Turmeric Exporter',
    avatar: '🌶️',
    location: 'Guntur, Andhra Pradesh',
    phone: '9876541230',
    online: true,
    lastMessage: 'Send moisture test report and photo of dried pods.',
    lastTime: '09:15 AM',
    unread: 1,
    messages: [
      {
        id: 'm2_1',
        sender: 'merchant',
        text: 'Hello farmer, we are buying Teja Red Chilli @ ₹22,000/Qtl for export.',
        time: '09:00 AM',
      },
      {
        id: 'm2_2',
        sender: 'merchant',
        text: 'Send moisture test report and photo of dried pods.',
        time: '09:15 AM',
      }
    ]
  },
  {
    id: 'chat_merchant_3',
    name: 'Kisan Fresh Vegetable Logistics',
    role: 'Supermarket Supply Network',
    avatar: '🍅',
    location: 'Nashik & Pune, Maharashtra',
    phone: '9988776655',
    online: false,
    lastMessage: 'Tomato collection center open tomorrow 6 AM to 2 PM.',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      {
        id: 'm3_1',
        sender: 'merchant',
        text: 'Tomato buying rate today is ₹32/Kg at APMC gate.',
        time: 'Yesterday',
      },
      {
        id: 'm3_2',
        sender: 'merchant',
        text: 'Tomato collection center open tomorrow 6 AM to 2 PM.',
        time: 'Yesterday',
      }
    ]
  }
];

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'comm_1',
    farmerName: 'Baldev Singh Dhillon',
    state: 'Punjab',
    crop: 'Wheat',
    text: 'Sowed HD-3086 last week. Got 94% germination with light sprinkler irrigation.',
    likes: 24,
    replies: 5,
    time: '2 hours ago'
  },
  {
    id: 'comm_2',
    farmerName: 'K. Murugan',
    state: 'Tamil Nadu',
    crop: 'Paddy',
    text: 'Thanjavur Mandi paddy price crossed ₹2,500/Qtl today. Good time to harvest.',
    likes: 38,
    replies: 12,
    time: '4 hours ago'
  }
];

export const chatService = {
  async getMerchantChats() {
    return INITIAL_MERCHANT_CHATS;
  },

  async sendMerchantMessage(chatId, messageText) {
    return {
      id: 'msg_' + Date.now(),
      sender: 'farmer',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
};
