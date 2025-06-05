import { UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import * as jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { WsAuthGuard } from "src/common/ws-guards/auth.guard";

@WebSocketGateway()
@UseGuards(WsAuthGuard)
export class BaseWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private static servers: Server[] = [];

  afterInit(server: Server) {
    BaseWebsocketGateway.servers.push(server);
  }

  handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.Authorization?.split(" ")[1];

    if (!token) {
      return socket.disconnect();
    }

    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      (socket as any).user = payload;
    } catch (err) {
      console.warn("Invalid or expired token");
      return socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  protected emitActivity(roomId: string, payload: any) {
    for (const server of BaseWebsocketGateway.servers) {
      server.to(roomId).emit("activity", payload);
    }
  }
}
