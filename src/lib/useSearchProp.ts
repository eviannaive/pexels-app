import { useSearchParams, usePathname, useRouter } from "next/navigation";
import type { SearchProp } from "@/types";

const useSearchProps = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);
  // console.log("useSearchProps", searchParams);

  const setSearchProps = (data: SearchProp[]) => {
    data.forEach((d) => {
      params.set(d.key, d.value);
    });
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
  const propPageReset = () => {
    params.delete("page");
    setUrl();
  };
  const setUrl = () => {
    router.replace(`${pathname}?${params.toString()}`);
  };
  return { setSearchProps, getSearchProp, propPageReset, setUrl };
};

export default useSearchProps;
