import { useQuery } from "@tanstack/react-query";

export default function useGetData(fetchQuery, queryKeys) {
  return useQuery({
    queryKey: queryKeys,
    queryFn: () =>
      fetch(`${fetchQuery}`, {
        method: "GET",
      }).then((res) => res.json()),
  });
}
