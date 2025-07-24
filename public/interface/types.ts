
export interface Event {
  event_id: string;
  name: string;
  location: string;
  date: string; // ISO string format
}

export interface Entry {
  entry_id: string;
  parent_event_id: string;
  date: string; // ISO string format
  start_time: string; // ISO string format
  end_time: string; // ISO string format
  timeframe: string; // ISO string format
  name: string;
  reason: string;
  date_time_added: string; // ISO string format
  done: boolean;
}
