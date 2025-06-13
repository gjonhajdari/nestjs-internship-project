import { UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import * as jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { WsAuthGuard } from "../common/ws-guards/auth.guard";
import { EmitEvents, ListenEvents } from "./interfaces/websocket-events.interface";

@WebSocketGateway()
@UseGuards(WsAuthGuard)
export class BaseWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ListenEvents, EmitEvents>;

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
    this.server.to(roomId).emit("activity", payload);
  }
}
