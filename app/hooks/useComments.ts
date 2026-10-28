import { useDebouncedState } from "@mantine/hooks";
import { useMemo, type SetStateAction } from "react";
import {
  type Comment,
  type CommentResponse,
  type PaginationSearchQuery,
} from "~/service/table/types";
import useFetch from "./useFetch";

const DEFAULT_QUERY: PaginationSearchQuery = {
  name: "",
  email: "",
  body: "",
  perPage: 20,
  next: 0,
};

type UseCommentReturnType = [
  CommentResponse | null,
  boolean,
  PaginationSearchQuery,
  (_new: SetStateAction<PaginationSearchQuery>) => void,
];

export default function useComments(): UseCommentReturnType {
  const [query, setQuery] = useDebouncedState(DEFAULT_QUERY, 200);

  const [commentResponse, loading] = useFetch<CommentResponse>(
    "/comments",
    {
      params: query,
    },
    [query],
  );

  return useMemo(
    () => [commentResponse, loading, query, setQuery],
    [commentResponse, loading, query, setQuery],
  );
}
