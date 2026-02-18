import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentStatusService } from "@/services/appointment.service";

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: string;
    }) => updateAppointmentStatusService(id, status),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries();

      const previousAppointments =
        queryClient.getQueryData<any[]>(["appointments"]);
      const previousFiltered =
        queryClient.getQueryData<any[]>(["filteredAppointments"]);

      // ✅ TanStack v5 correct syntax
      queryClient.setQueriesData(
        { queryKey: ["appointments"] },
        (old: any) =>
          old?.map((a: any) =>
            a.id === id ? { ...a, status } : a,
          ),
      );

      queryClient.setQueriesData(
        { queryKey: ["filteredAppointments"] },
        (old: any) =>
          old?.map((a: any) =>
            a.id === id ? { ...a, status } : a,
          ),
      );

      return { previousAppointments, previousFiltered };
    },

    // ❌ rollback on error
    onError: (_err, _vars, context) => {
      if (context?.previousAppointments) {
        queryClient.setQueryData(
          ["appointments"],
          context.previousAppointments,
        );
      }
      if (context?.previousFiltered) {
        queryClient.setQueryData(
          ["filteredAppointments"],
          context.previousFiltered,
        );
      }
    },

    // 🔄 sync with backend
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["filteredAppointments"] });
    },
  });
};
