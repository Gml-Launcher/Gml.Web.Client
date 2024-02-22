import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/shared/services/ProfileService";

export const useProfiles = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => profileService.getProfiles(),
  });

  return { data: data?.data, isLoading };
};
