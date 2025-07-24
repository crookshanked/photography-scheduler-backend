
import { Event, Entry } from '../types';

const today = new Date();

const generatePastDate = (daysAgo: number): string => {
  const date = new Date(today);
  date.setDate(today.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const generateFutureDate = (daysAhead: number): string => {
  const date = new Date(today);
  date.setDate(today.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

const generateDateTime = (dateStr: string, hour: number, minute: number): string => {
    const date = new Date(dateStr);
    date.setUTCHours(hour, minute, 0, 0);
    return date.toISOString();
}

export const mockEvents: Event[] = [
  { id: 'evt1', name: 'Spring Hill High School - 2025-2026 Seniors', location: '123 Panther Lane', date: generateFutureDate(0) },
  { id: 'evt2', name: 'Westwood Academy Graduation Photos', location: '456 Warrior Way', date: generateFutureDate(5) },
  { id: 'evt3', name: 'Oakside College Fall Portraits', location: '789 Eagle Drive', date: generateFutureDate(10) },
  { id: 'evt4', name: 'Maple Grove High School - Senior Pictures', location: '101 Maple Ave', date: generatePastDate(30) },
  { id: 'evt5', name: 'Central City University Headshots', location: '202 University Blvd', date: generatePastDate(60) },
];

export const mockEntries: Entry[] = [
  // Entries for Event 1 (Upcoming)
  { id: 'ent101', eventId: 'evt1', name: 'Michael Thoennes', package: 'Essentials 2', dateTime: generateDateTime(mockEvents[0].date, 10, 5), done: true },
  { id: 'ent102', eventId: 'evt1', name: 'Mason Blevins', package: 'Elite Indoor + Outdoor', dateTime: generateDateTime(mockEvents[0].date, 8, 50), done: false },
  { id: 'ent103', eventId: 'evt1', name: 'Juliana Graham', package: 'Essentials 2', dateTime: generateDateTime(mockEvents[0].date, 14, 0), done: false },
  { id: 'ent104', eventId: 'evt1', name: 'Logan DiLorenzo', package: 'Essentials 2', dateTime: generateDateTime(mockEvents[0].date, 11, 20), done: false },
  { id: 'ent105', eventId: 'evt1', name: 'Zulia Markley', package: 'Elite Outdoor', dateTime: generateDateTime(mockEvents[0].date, 14, 20), done: false },
  { id: 'ent106', eventId: 'evt1', name: 'Keira Hanscom', package: 'Elite Indoor', dateTime: generateDateTime(mockEvents[0].date, 15, 55), done: false },
  { id: 'ent107', eventId: 'evt1', name: 'Charlee Blake', package: 'Essentials 3', dateTime: generateDateTime(mockEvents[0].date, 15, 20), done: false },
  { id: 'ent108', eventId: 'evt1', name: 'Ashton Brown', package: 'Essentials 3', dateTime: generateDateTime(mockEvents[0].date, 15, 20), done: false },
  { id: 'ent109', eventId: 'evt1', name: 'Jonathan Weston', package: 'Elite', dateTime: generateDateTime(mockEvents[0].date, 15, 20), done: false },

  // Entries for Event 4 (Past)
  { id: 'ent401', eventId: 'evt4', name: 'Olivia Chen', package: 'Standard', dateTime: generateDateTime(mockEvents[3].date, 9, 0), done: true },
  { id: 'ent402', eventId: 'evt4', name: 'Benjamin Carter', package: 'Premium', dateTime: generateDateTime(mockEvents[3].date, 9, 30), done: true },
  { id: 'ent403', eventId: 'evt4', name: 'Sophia Rodriguez', package: 'Standard', dateTime: generateDateTime(mockEvents[3].date, 10, 0), done: true },
];
