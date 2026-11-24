// Shared data shapes used by src/data.ts and the components.

export interface NavItem {
  label: string;
  href: string;
}

export interface ServicePosition {
  pos: string;
  name: string;
  email: string | null;
  term: string;
}

export interface Workshop {
  year: string;
  text: string;
  link?: string;
}

export interface MeetingCode {
  ID: string;
  Value: string;
  Label: string;
}

// Matches the records produced by district-utils (`./district -javascript`),
// so its output can be pasted into ALL_MEETINGS unchanged.
export interface Meeting {
  name: string;
  id: string | null;
  day: string;
  time: string;
  location: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  notes: string | null;
  codes: string[];
  zoom_id: string | null;
  zoom_passcode: string | null;
  zoom_url: string | null;
  motm: string | null;
}
