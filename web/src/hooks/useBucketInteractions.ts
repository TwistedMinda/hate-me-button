import { fromBigNumber, parseEther, toEther, useEthereumConfig } from 'utils/eth.utils';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';

const filterBucket = <ContractInput>(
  item: ContractInput
) => {
  const accountInfo = item as any;
  return {
    hated: fromBigNumber(accountInfo.hated),
    loved: fromBigNumber(accountInfo.loved),
    gains: toEther(accountInfo.gains),
    exists: accountInfo.exists,
  };
};

const decode = (name: string) => {
  const bytes = []
  for (const letter of name) {
    bytes.push(Number(letter))
  }
  return bytes
}

export const useHate = (name: string) => {
  const cfg = useEthereumConfig();
  const encoded = decode(name)
  const { config } = usePrepareContractWrite({
    ...cfg,
    functionName: 'hateYou',
    args: [encoded as any],
    overrides: {
      value: parseEther((0.001).toString())
    }
  });
  const { writeAsync, isLoading } = useContractWrite(config);
  const hate = async () => writeAsync?.();
  return {
    hate,
    isLoading
  };
};

export const useLove = (name: string) => {
  const cfg = useEthereumConfig();
  const encoded = decode(name)
  const { config } = usePrepareContractWrite({
    ...cfg,
    functionName: 'kiddingILoveYou',
    args: [encoded as any],
    overrides: {
      value: parseEther((0.001).toString())
    }
  });
  const { writeAsync, isLoading } = useContractWrite(config);
  const love = async () => writeAsync?.();

  return {
    love,
    isLoading
  };
};

export const useBucketInteractions = (slug: string) => {
  const cfg = useEthereumConfig();
  const { hate } = useHate(slug)
  const { love } = useLove(slug)
  const { data, isLoading, error, refetch } = useContractRead({
    ...cfg,
    functionName: 'buckets',
    args: slug ? [decode(slug) as any] : undefined,
    select: filterBucket,
    watch: true
  });


  return {
    data,
    isLoading,
    error,
    refresh: refetch,
    
    hates: data?.hated ?? 0,
    loves: data?.loved ?? 0,
    onLove: () => {
      love()
    },
    onHate: () => {
      hate()
    }
  };
};
