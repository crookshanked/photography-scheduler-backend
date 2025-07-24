
export interface Event {
  id: string;
  name: string;
  location: string;
  date: string; // ISO string format
}

export interface Entry {
  id: string;
  eventId: string;
  name: string;
  package: string;
  dateTime: string; // ISO string format
  done: boolean;
}
