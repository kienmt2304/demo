import type { STATUSES } from ".";

export type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export type CommentResponse = {
  data: Comment[];
  total: number;
};

export type SearchKeys = "name" | "email" | "body";

export type SearchQuery = Partial<Pick<Comment, SearchKeys>>;

export type PaginationSearchQuery = SearchQuery & {
  perPage: number;
  next: number;
};

export type Status = (typeof STATUSES)[number];

export type Row = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: Status;
  createdAt: Date;
  amount: number;
};

export type SortKey = Exclude<keyof Row, "id">;
export type SortDirection = "asc" | "desc";
export type SortState = { key: SortKey; direction: SortDirection } | null;

export type StatusFilter = Status | "all";

export type GetRowProps = {
  search?: string;
  status?: StatusFilter;
  sort?: SortState;
  pageSize?: number;
  page?: number;
};

export type GetRowReturnType = {
  pageRows: Row[];
  sortedCount: number;
};
