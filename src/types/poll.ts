export interface User {
  id: number;
  username: string;
  password?: string;
}

export interface Option {
  id: number;
  text: string;
  vote_count: number;
}

export interface Poll {
  id: number;
  title: string;
  description?: string;
  expiry_date: string;
  created_at: string;
  created_by: string;  // Changed from number to string (username)
  options?: Option[];
  total_votes?: number;  // Added this field
}

export interface PollsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Poll[];
}