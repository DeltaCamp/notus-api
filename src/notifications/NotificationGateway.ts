import {
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Client, Server } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  async add(notification) {
    this.server.of('/notifications').emit('add', notification.id)
  }

  async remove(notification) {
    this.server.of('/notifications').emit('remove', notification.id)
  }
}
