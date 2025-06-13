export interface RoomsListenEvents {
  "rooms/join": (data: { roomId: string }) => void;
  "rooms/leave": (data: { roomId: string }) => void;
}

export interface RoomsEmitEvents {
  "rooms/joined": (data: { userId: string }) => void;
  "rooms/left": (data: { userId: string }) => void;
}
