import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function useDeleteData(
  deleteFunction,
  toastSuccesMsg,
  queryKeys,
  navigatePath
) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (e) => deleteFunction(e),
    onSuccess: () => {
      toast.success(toastSuccesMsg);
      queryClient.cancelQueries(queryKeys);
      queryClient.invalidateQueries(queryKeys[0]);
      if (navigatePath) router.replace(navigatePath);
    },
    onError: (error) => toast.error(error.message),
  });
}
