export interface RoomsListenEvents {
  "rooms/join": (data: { roomId: string }) => void;
  "rooms/leave": (data: { roomId: string }) => void;
  "rooms/archive": (data: { roomId: string }) => void;
  "rooms/remove": (data: { roomId: string; userId: string }) => void;
}

export interface RoomsEmitEvents {
  "rooms/joined": (data: { userId: string }) => void;
  "rooms/left": (data: { userId: string }) => void;
  "rooms/archived": (data: { roomId: string }) => void;
  "rooms/removed": (data: { userId: string }) => void;
}
