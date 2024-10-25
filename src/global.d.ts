declare global {
    namespace globalThis {
        var onlineUsers: Map<string, string>;// Map para armazenar usuários online
        var chatSocket: Socket; // Socket.IO Socket (opcional)
    }

  }

export {};