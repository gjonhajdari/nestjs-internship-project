import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth?.Authorization?.split(" ")[1];

    if (!token) return false;

    try {
      const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      (client as any).user = id;
      return true;
    } catch (error) {
      return false;
    }
  }
}
