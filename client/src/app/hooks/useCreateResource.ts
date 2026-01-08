'use client';

import {
  useCreatePath,
  useRedirect,
  CreatePathParams,
} from 'react-admin';

type ResourceAction = 'list' | 'create' | 'edit' | 'show';

type UseResourceActionParams = {
  resource: string;
  action: ResourceAction;
  id?: string | number;
};

const useResourceAction = ({
  resource,
  action,
  id,
}: UseResourceActionParams) => {
  const createPath = useCreatePath();
  const redirect = useRedirect();

  return () => {
    const path = createPath({
      resource,
      type: action,
      id,
    } as CreatePathParams);

    redirect(path);
  };
};

export default useResourceAction;
export { useResourceAction };

