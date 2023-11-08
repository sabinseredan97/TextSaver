import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useEditData(
  editFunction,
  toastSuccesMsg,
  queryKeys,
  setEditState
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (e) => editFunction(e),
    onSuccess: () => {
      toast.success(toastSuccesMsg);
      setEditState((prevState) => !prevState);
      queryClient.invalidateQueries(queryKeys);
    },
    onError: (error) => toast.error(error.message),
  });
}
