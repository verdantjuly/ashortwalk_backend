import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MemberService } from 'src/group/services/member.service';
import { MessageService } from './services/message.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://ashortwalk-gkd3dvdpfcexb0ce.koreacentral-01.azurewebsites.net',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private rooms: { [key: string]: Set<string> } = {};
  private users: { [key: string]: string } = {};
  constructor(
    private readonly memberService: MemberService,
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(socket: Socket): Promise<void> {
    try {
      console.log('Client connected', socket.id);
      const token = socket.handshake.auth.token.split(' ')[1];

      if (!token) {
        socket.emit('error', 'You are not a member of this group');
        socket.disconnect();
        return;
      }

      const user = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_JWT_SECRET,
      });

      socket.data.user = user.payload;
      const groupId = socket.handshake.query.groupId as string;

      if (user.payload.role !== 'admin') {
        // 그룹 멤버 여부 확인
        const isMember = await this.memberService.findMember(
          groupId,
          user.payload.id,
        );
        console.log(isMember);
        if (!isMember) {
          socket.emit('error', 'You are not a member of this group');
          socket.disconnect();
          return;
        }
      }
      this.users[user.payload.nickname] = socket.id;
      if (!this.rooms[groupId]) {
        this.rooms[groupId] = new Set<string>();
      }
      this.rooms[groupId].add(user.payload.nickname);
    } catch (err) {}
  }

  @SubscribeMessage('chat:message')
  async handleChatMessage(
    @MessageBody()
    {
      nickname,
      room,
      message,
    }: {
      nickname: string;
      room: string;
      message: string;
    },
  ) {
    // MongoDB에 메시지 저장
    await this.messageService.saveMessage(nickname, room, message);
    const sendRoom = this.rooms[room];
    console.log(this.rooms);
    // 방에 메시지 전송
    sendRoom?.forEach(user => {
      const userSocketId = this.users[user];
      if (userSocketId) {
        this.server
          .to(userSocketId)
          .emit('chat:message', { nickname, content: message }); // 해당 사용자에게 메시지 전송
      }
    });
  }

  @SubscribeMessage('get:prev')
  async handleGetMessage(
    @MessageBody() { room }: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.messageService.getMessagesByRoom(room);
    messages.map(msg => {
      client.emit('chat:message', msg);
    });
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    console.log('Client disconnected', socket.id);
    for (const [nickname, socketId] of Object.entries(this.users)) {
      if (socketId === socket.id) {
        delete this.users[nickname];
      }
    }
  }
}
