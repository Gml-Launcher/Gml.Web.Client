import { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

import { ClientBuildFormSchemaType } from '../static';

import { useConnectionHub } from '@/widgets/generate-launcher-dialog';

interface UseOnSubmitBuildParams {
  connectionHub: ReturnType<typeof useConnectionHub>['connectionHub'];
  state: ReturnType<typeof useConnectionHub>['build'];
  version: string;
}

export const useOnSubmit = ({ connectionHub, state, version }: UseOnSubmitBuildParams) => {
  const onSubmit: SubmitHandler<ClientBuildFormSchemaType> = async (
    data: ClientBuildFormSchemaType,
  ) => {
    try {
      state.setIsBuilding(() => true);
      connectionHub?.invoke('Compile', version, data.operatingSystem).then(() => {});
    } catch (error: unknown) {
      toast.error('Ошибка', {
        description: JSON.stringify(error),
      });
    } finally {
      state.setLogs(null);
    }
  };
  return { onSubmit };
};
