import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage
} from '@nestjs/websockets'
import { Client, Server } from 'socket.io';

@WebSocketGateway({ transports: ['websocket'] })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  async add(notificationId: string) {
    this.server.sockets.emit('/notifications/add', notificationId)
  }

  async remove(notificationId: string) {
    this.server.sockets.emit('/notifications/remove', notificationId)
  }
}
