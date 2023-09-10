import { useEthereumConfig } from 'utils/eth.utils';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export const useClaim = (enabled: boolean) => {
  const cfg = useEthereumConfig();
  const { config } = usePrepareContractWrite({
    ...cfg,
    functionName: 'claim',
    enabled: enabled
  });
  const { writeAsync, isLoading } = useContractWrite(config);
  const sell = async () => writeAsync?.();

  return {
    sell,
    isLoading
  };
};
