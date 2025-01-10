import { useSearchParams, usePathname, useRouter } from "next/navigation";

const useSearchProps = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const setSearchProps = (key: string, value: any) => {
    params.set(key, value.toString());
    setUrl();
  };
  const getSearchProp = (keys: string[]) => {
    return keys.reduce(
      (acc, crr) => {
        const value = params.get(crr);
        value && (acc[crr] = value);
        return acc;
      },
      {} as Record<string, string>,
    );
  };
  const setUrl = () => {
    router.push(`${pathname}?${params.toString()}`);
  };
  return { setSearchProps, getSearchProp, setUrl };
};

export default useSearchProps;
