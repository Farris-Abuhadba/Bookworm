export interface Novel {
    title: string;
    url: string;

    author?: string;
    cover?: string;

    chapter_count?: number;
    views?: number;
    rating?: number;
    status?: "Completed" | "On Going" | "Dropped" | "Hiatus";

    genres?: string[];

    chapters?: Chapter[];
}

export interface Chapter {
    title: string;
    url: string;

    content?: string[];

    timestamp?: number;
}
