import { JwtPayload } from './jwt-payload.inteface';

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
