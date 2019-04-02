import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage
} from '@nestjs/websockets'
import { Client, Server } from 'socket.io';

@WebSocketGateway({ transports: ['websocket'] })
export class EventGateway {
  @WebSocketServer()
  server: Server;

  async add(eventId: number) {
    this.server.sockets.emit('/events/add', eventId)
  }

  async remove(eventId: number) {
    this.server.sockets.emit('/events/remove', eventId)
  }
}
