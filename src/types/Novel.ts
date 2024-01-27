export interface Novel {
  title: string;
  id: string;

  author?: string;
  image?: string;

  description?: string;
  chapter_count?: number;
  views?: number;
  rating?: number;
  status?: "Completed" | "On Going" | "Dropped" | "Hiatus";

  genres?: string[];

  chapters?: Chapter[];
}

export interface Chapter {
  title: string;
  id: string;

  index?: number;
  content?: string[];

  timestamp?: number;
}
