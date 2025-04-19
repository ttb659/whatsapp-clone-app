import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private currentUser: User = {
    id: 1,
    name: 'Utilisateur Démo',
    email: 'demo@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Utilisateur+Demo&background=random',
    created_at: '2025-04-18T10:00:00.000Z',
    updated_at: '2025-04-18T10:00:00.000Z'
  };

  private users: User[] = [
    this.currentUser,
    {
      id: 2,
      name: 'Alice Martin',
      email: 'alice@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Martin&background=random',
      created_at: '2025-04-18T10:00:00.000Z',
      updated_at: '2025-04-18T10:00:00.000Z'
    },
    {
      id: 3,
      name: 'Bob Dupont',
      email: 'bob@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Dupont&background=random',
      created_at: '2025-04-18T10:00:00.000Z',
      updated_at: '2025-04-18T10:00:00.000Z'
    },
    {
      id: 4,
      name: 'Claire Dubois',
      email: 'claire@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Claire+Dubois&background=random',
      created_at: '2025-04-18T10:00:00.000Z',
      updated_at: '2025-04-18T10:00:00.000Z'
    },
    {
      id: 5,
      name: 'David Moreau',
      email: 'david@example.com',
      avatar: 'https://ui-avatars.com/api/?name=David+Moreau&background=random',
      created_at: '2025-04-18T10:00:00.000Z',
      updated_at: '2025-04-18T10:00:00.000Z'
    }
  ];

  private conversations: Conversation[] = [
    {
      id: 1,
      user_one_id: 1,
      user_two_id: 2,
      created_at: '2025-04-18T10:05:00.000Z',
      updated_at: '2025-04-18T15:30:00.000Z',
      user_one: this.users[0],
      user_two: this.users[1],
      user: this.users[1], // L'autre utilisateur dans la conversation
      unread_count: 2,
      is_group: false
    },
    {
      id: 2,
      user_one_id: 1,
      user_two_id: 3,
      created_at: '2025-04-18T11:15:00.000Z',
      updated_at: '2025-04-18T14:20:00.000Z',
      user_one: this.users[0],
      user_two: this.users[2],
      user: this.users[2], // L'autre utilisateur dans la conversation
      unread_count: 0,
      is_group: false
    },
    {
      id: 3,
      user_one_id: 1,
      user_two_id: 4,
      created_at: '2025-04-18T12:30:00.000Z',
      updated_at: '2025-04-18T13:45:00.000Z',
      user_one: this.users[0],
      user_two: this.users[3],
      user: this.users[3], // L'autre utilisateur dans la conversation
      unread_count: 1,
      is_group: false
    }
  ];

  private groups: Group[] = [
    {
      id: 1,
      name: 'Groupe de projet',
      description: 'Discussions sur le projet WhatsApp Clone',
      creator_id: 1,
      created_by: 1,
      created_at: '2025-04-18T10:00:00.000Z',
      updated_at: '2025-04-18T16:00:00.000Z',
      users: [this.users[0], this.users[1], this.users[2]],
      members: [this.users[0], this.users[1], this.users[2]],
      unread_count: 3,
      is_group: true
    },
    {
      id: 2,
      name: 'Amis',
      description: 'Groupe d\'amis',
      creator_id: 2,
      created_by: 2,
      created_at: '2025-04-18T11:00:00.000Z',
      updated_at: '2025-04-18T15:00:00.000Z',
      users: [this.users[0], this.users[1], this.users[3], this.users[4]],
      members: [this.users[0], this.users[1], this.users[3], this.users[4]],
      unread_count: 0,
      is_group: true
    }
  ];

  private messages: { [key: string]: Message[] } = {
    'conversation_1': [
      {
        id: 1,
        sender_id: 2,
        conversation_id: 1,
        content: 'Bonjour ! Comment ça va ?',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T10:05:00.000Z',
        updated_at: '2025-04-18T10:05:00.000Z',
        sender: this.users[1],
        user: this.users[1],
        user_id: 2
      },
      {
        id: 2,
        sender_id: 1,
        conversation_id: 1,
        content: 'Salut Alice ! Ça va bien, merci. Et toi ?',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T10:10:00.000Z',
        updated_at: '2025-04-18T10:10:00.000Z',
        sender: this.users[0],
        user: this.users[0],
        user_id: 1
      },
      {
        id: 3,
        sender_id: 2,
        conversation_id: 1,
        content: 'Très bien ! Je travaille sur un nouveau projet.',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T10:15:00.000Z',
        updated_at: '2025-04-18T10:15:00.000Z',
        sender: this.users[1],
        user: this.users[1],
        user_id: 2
      },
      {
        id: 4,
        sender_id: 1,
        conversation_id: 1,
        content: 'Super ! Quel genre de projet ?',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T10:20:00.000Z',
        updated_at: '2025-04-18T10:20:00.000Z',
        sender: this.users[0],
        user: this.users[0],
        user_id: 1
      },
      {
        id: 5,
        sender_id: 2,
        conversation_id: 1,
        content: 'Une application de messagerie, un peu comme WhatsApp !',
        is_read: false,
        is_edited: false,
        created_at: '2025-04-18T15:30:00.000Z',
        updated_at: '2025-04-18T15:30:00.000Z',
        sender: this.users[1],
        user: this.users[1],
        user_id: 2
      }
    ],
    'conversation_2': [
      {
        id: 6,
        sender_id: 3,
        conversation_id: 2,
        content: 'Salut ! Tu as vu le dernier film ?',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T11:15:00.000Z',
        updated_at: '2025-04-18T11:15:00.000Z',
        sender: this.users[2],
        user: this.users[2],
        user_id: 3
      },
      {
        id: 7,
        sender_id: 1,
        conversation_id: 2,
        content: 'Pas encore, il est bien ?',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T11:20:00.000Z',
        updated_at: '2025-04-18T11:20:00.000Z',
        sender: this.users[0],
        user: this.users[0],
        user_id: 1
      },
      {
        id: 8,
        sender_id: 3,
        conversation_id: 2,
        content: 'Oui, vraiment génial ! Je te le recommande.',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T14:20:00.000Z',
        updated_at: '2025-04-18T14:20:00.000Z',
        sender: this.users[2],
        user: this.users[2],
        user_id: 3
      }
    ],
    'conversation_3': [
      {
        id: 9,
        sender_id: 4,
        conversation_id: 3,
        content: 'Bonjour ! On se retrouve pour le déjeuner demain ?',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T12:30:00.000Z',
        updated_at: '2025-04-18T12:30:00.000Z',
        sender: this.users[3],
        user: this.users[3],
        user_id: 4
      },
      {
        id: 10,
        sender_id: 1,
        conversation_id: 3,
        content: 'Oui, avec plaisir ! À midi au restaurant habituel ?',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T12:35:00.000Z',
        updated_at: '2025-04-18T12:35:00.000Z',
        sender: this.users[0],
        user: this.users[0],
        user_id: 1
      },
      {
        id: 11,
        sender_id: 4,
        conversation_id: 3,
        content: 'Parfait ! À demain alors.',
        is_read: false,
        is_edited: false,
        created_at: '2025-04-18T13:45:00.000Z',
        updated_at: '2025-04-18T13:45:00.000Z',
        sender: this.users[3],
        user: this.users[3],
        user_id: 4
      }
    ],
    'group_1': [
      {
        id: 12,
        sender_id: 1,
        group_id: 1,
        content: 'Bienvenue dans le groupe de projet !',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T10:00:00.000Z',
        updated_at: '2025-04-18T10:00:00.000Z',
        sender: this.users[0],
        user: this.users[0],
        user_id: 1
      },
      {
        id: 13,
        sender_id: 2,
        group_id: 1,
        content: 'Merci ! Quelles sont les prochaines étapes ?',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T10:05:00.000Z',
        updated_at: '2025-04-18T10:05:00.000Z',
        sender: this.users[1],
        user: this.users[1],
        user_id: 2
      },
      {
        id: 14,
        sender_id: 3,
        group_id: 1,
        content: 'On devrait commencer par définir les fonctionnalités principales.',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T10:10:00.000Z',
        updated_at: '2025-04-18T10:10:00.000Z',
        sender: this.users[2],
        user: this.users[2],
        user_id: 3
      },
      {
        id: 15,
        sender_id: 1,
        group_id: 1,
        content: 'Bonne idée ! Je propose : authentification, messagerie en temps réel, gestion des groupes...',
        is_read: false,
        is_edited: false,
        created_at: '2025-04-18T16:00:00.000Z',
        updated_at: '2025-04-18T16:00:00.000Z',
        sender: this.users[0],
        user: this.users[0],
        user_id: 1
      }
    ],
    'group_2': [
      {
        id: 16,
        sender_id: 2,
        group_id: 2,
        content: 'Salut tout le monde ! Qui est libre ce weekend ?',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T11:00:00.000Z',
        updated_at: '2025-04-18T11:00:00.000Z',
        sender: this.users[1],
        user: this.users[1],
        user_id: 2
      },
      {
        id: 17,
        sender_id: 1,
        group_id: 2,
        content: 'Je suis libre samedi après-midi !',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T11:05:00.000Z',
        updated_at: '2025-04-18T11:05:00.000Z',
        sender: this.users[0],
        user: this.users[0],
        user_id: 1
      },
      {
        id: 18,
        sender_id: 4,
        group_id: 2,
        content: 'Moi aussi !',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T11:10:00.000Z',
        updated_at: '2025-04-18T11:10:00.000Z',
        sender: this.users[3],
        user: this.users[3],
        user_id: 4
      },
      {
        id: 19,
        sender_id: 5,
        group_id: 2,
        content: 'Je ne peux pas ce weekend, désolé.',
        is_read: true,
        is_edited: false,
        created_at: '2025-04-18T15:00:00.000Z',
        updated_at: '2025-04-18T15:00:00.000Z',
        sender: this.users[4],
        user: this.users[4],
        user_id: 5
      }
    ]
  };

  constructor() { }

  getCurrentUser(): User {
    return this.currentUser;
  }

  getUsers(): User[] {
    return this.users.filter(user => user.id !== this.currentUser.id);
  }

  getConversations(): Conversation[] {
    // Ajouter le dernier message à chaque conversation
    return this.conversations.map(conversation => {
      const messages = this.messages[`conversation_${conversation.id}`];
      if (messages && messages.length > 0) {
        conversation.last_message = messages[messages.length - 1];
      }
      return conversation;
    });
  }

  getGroups(): Group[] {
    // Ajouter le dernier message à chaque groupe
    return this.groups.map(group => {
      const messages = this.messages[`group_${group.id}`];
      if (messages && messages.length > 0) {
        group.last_message = messages[messages.length - 1];
      }
      return group;
    });
  }

  getConversationMessages(conversationId: number): Message[] {
    return this.messages[`conversation_${conversationId}`] || [];
  }

  getGroupMessages(groupId: number): Message[] {
    return this.messages[`group_${groupId}`] || [];
  }

  // Méthode pour ajouter un nouveau message (pour la démo)
  addMessage(message: Partial<Message>): Message {
    const newId = Math.max(...Object.values(this.messages).flat().map(m => m.id)) + 1;
    
    const newMessage: Message = {
      id: newId,
      sender_id: this.currentUser.id,
      content: message.content || '',
      is_read: false,
      is_edited: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender: this.currentUser,
      user: this.currentUser,
      user_id: this.currentUser.id,
      ...message
    };

    let key = '';
    if (message.conversation_id) {
      key = `conversation_${message.conversation_id}`;
      
      // Mettre à jour la date de la conversation
      const conversation = this.conversations.find(c => c.id === message.conversation_id);
      if (conversation) {
        conversation.updated_at = newMessage.created_at;
        conversation.last_message = newMessage;
      }
    } else if (message.group_id) {
      key = `group_${message.group_id}`;
      
      // Mettre à jour la date du groupe
      const group = this.groups.find(g => g.id === message.group_id);
      if (group) {
        group.updated_at = newMessage.created_at;
        group.last_message = newMessage;
      }
    }

    if (key && this.messages[key]) {
      this.messages[key].push(newMessage);
    } else if (key) {
      this.messages[key] = [newMessage];
    }

    return newMessage;
  }
}