import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReceptionistService } from "@/services/receptionist.service";

export const useUpdateReceptionist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => {
      console.log("🚀 updateReceptionistService CALLED");
      console.log("ID:", id);
      console.log("DATA:", data);

      return updateReceptionistService(id, data);
    },

    onSuccess: () => {
      console.log("🔁 INVALIDATING receptionists QUERY");

      queryClient.invalidateQueries({
        queryKey: ["receptionists"],
      });
    },

    onError: (error) => {
      console.error("❌ UPDATE FAILED:", error);
    },
  });
};
