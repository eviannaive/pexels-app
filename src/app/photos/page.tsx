"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useEffect, useState, useRef, useTransition } from "react";
import axios from "axios";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

import Image from "next/image";
import Pagination from "@/components/Pagination";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import downloadImg from "@/lib/downloadImage";

// context
// import { useModalContext } from "@/context/ModalContext";
import { useSearchContext } from "@/context/searchContext";
import { useModalStore } from "@/store/store";

// components
import { LoadingFull } from "@/components/Loading";
import { NoResult } from "@/components/NoResult";
import SearchBar from "@/components/SearchBar";
import { Enlarge } from "@/components/Enlarge";

const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_KET;

// default keyword
const demoList = [
  "cat flower",
  "lake boat",
  "desert night meteor",
  "european style architecture",
  "violin",
  "bridge",
  "rainbow",
];

const gridBreakpoints: {
  [key: string]: number;
} = {
  "768": 4,
  "450": 3,
  "0": 2,
};

export default function Photos() {
  const { data: session } = useSession();

  let {
    setSearchBtnShow,
    inputValue,
    resultInfo,
    setResultInfo,
    photosArr,
    setPhotosArr,
    isPending,
    startTransition,
    initFetch,
    firstSearch,
    inputRef,
  }: any = useSearchContext();

  // const { setModalShow, setModalType, setImgId, setImgSrc,downloadImg} : any = useModalContext();
  const stores = useModalStore((state) => state);
  const { modalOpen, setModalType, setSelectImg } = stores;

  const perPage = 12;

  const randomKeyword = useMemo(() => {
    const item = demoList[Math.floor(Math.random() * demoList.length)];
    console.log("usememo", item);
    return item;
  }, []);

  const [enlargeShow, setEnlargeShow] = useState(false);
  const [winSize, setWinSize] = useState({
    width: 0,
    height: 0,
  });
  const [gridCol, setGridCol] = useState(4);
  const [keyword, setKeyword] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR(
    [keyword, page, randomKeyword],
    () => {
      const query = keyword ?? randomKeyword;
      return axios
        .get(
          `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=${page}`,
          {
            headers: {
              Authorization: pexelsKey,
            },
          },
        )
        .then((res) => res.data);
    },
  );

  const findBreakpoints = () => {
    const key: keyof typeof gridBreakpoints =
      Object.keys(gridBreakpoints)
        .reverse()
        .find((b) => window.innerWidth > Number(b)) ?? "0";
    setGridCol(gridBreakpoints?.[key]);
  };

  const windowResize = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const handleModalOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    const $img = (e.target as HTMLElement)?.closest("[box-wrap]")
      ?.firstChild as HTMLElement;
    setSelectImg($img.getAttribute("img-id"), $img.getAttribute("src"));
    session ? setModalType("like") : setModalType("login");
    modalOpen();
  };

  const handleDownload = (e: React.MouseEvent<HTMLDivElement>) => {
    const $el = (e.target as HTMLElement)?.closest("[box-wrap]")?.firstChild;
    downloadImg(
      String(($el as HTMLElement)?.getAttribute("img-id")),
      String(($el as HTMLElement)?.getAttribute("src")),
    );
  };

  const handleEnlarge = (e: React.MouseEvent<HTMLImageElement>) => {
    const $img = (e.target as HTMLElement)?.closest("[box-wrap]")
      ?.firstChild as HTMLElement;
    setSelectImg($img.getAttribute("img-id"), $img.getAttribute("src"));
    setEnlargeShow(true);
  };

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  class SearchPropControl {
    params = new URLSearchParams(searchParams);
    setProp({ value, page }: { value?: string; page?: number }) {
      value && this.params.set("query", value);
      page && page > 1
        ? this.params.set("page", String(page))
        : this.params.delete("page");
      this.setUrl();
    }
    getSearchProp() {
      const query = this.params.get("query");
      const page = this.params.get("page");
      return { query, page };
    }
    propPageReset() {
      this.params.delete("page");
      this.setUrl();
    }
    setUrl() {
      router.replace(`${pathname}?${this.params.toString()}`);
    }
  }

  // memo static data
  const searchMemo = useMemo(() => {
    return {
      input: inputValue || initFetch.current,
      length: photosArr.length,
      allPages: Math.ceil(resultInfo.total_results / perPage),
    };
  }, [photosArr]);

  const urlMemo = useMemo(() => {
    return new SearchPropControl();
  }, []);

  // fetch
  const fetchData = async ({
    value,
    url,
    page = 1,
  }: {
    value?: string;
    url?: string;
    page?: number;
  }) => {
    // setLoading(true)
    startTransition(async () => {
      const searchURL =
        url ||
        `https://api.pexels.com/v1/search?query=${value}&per_page=${perPage}&page=${page}`;
      const result = await axios.get(searchURL, {
        headers: {
          Authorization: pexelsKey,
        },
      });
      setResultInfo(result.data);
      setPhotosArr(result.data.photos);
    });
  };

  // search
  const searchHandler = () => {
    console.log("submit");
    setKeyword(inputValue);
    if (searchMemo.input === inputValue) return;
    fetchData({ value: inputValue });
    urlMemo.setProp({ value: inputValue });
    urlMemo.propPageReset();
    firstSearch.current = false;
  };

  useEffect(() => {
    findBreakpoints();
    if (!initFetch.current) {
      const { query, page } = urlMemo.getSearchProp();
      if (query) {
        firstSearch.current = false;
        inputRef.current.value = query;
        setSearchBtnShow(true);
      }

      initFetch.current = randomKeyword;
      // setKeyword(randomKeyword);
      // fetchData({ value: query ?? randomKeyword(), page: Number(page) });
    }

    window.addEventListener("resize", () => {
      setWinSize(windowResize());
      findBreakpoints();
    });

    return () => {
      setWinSize(windowResize());
    };
  }, []);

  useEffect(() => {
    console.log(data, "data");
  }, [data]);

  // pagination event
  class PaginationControl {
    setPageProp(pageNum: number) {
      urlMemo.setProp({ page: pageNum });
    }
    async prev() {
      if (!resultInfo.prev_page) return;
      await fetchData({ url: resultInfo.prev_page });
      this.setPageProp(resultInfo.page - 1);
    }
    async next() {
      if (!resultInfo.next_page) return;
      await fetchData({ url: resultInfo.next_page });
      this.setPageProp(resultInfo.page + 1);
    }
    async toPage(page: number) {
      const pageNum = page > searchMemo.allPages ? searchMemo.allPages : page;
      await fetchData({ value: searchMemo.input, page: pageNum });
      this.setPageProp(pageNum);
    }
  }

  const paginationHandler = useMemo(() => {
    return new PaginationControl();
  }, [data]);

  return (
    <div className="pt-[50px] pb-[80px] px-[40px] max-w-[1500px] mx-auto max-[840px]:px-[20px] max-[840px]:pb-[60px]">
      <Enlarge
        state={enlargeShow}
        setEnlargeShow={setEnlargeShow}
        eventLike={handleModalOpen}
      />
      <SearchBar
        event={setKeyword}
        placeholder={randomKeyword ?? ""}
        // defaultValue="aaa"
      />
      {isLoading && <LoadingFull />}
      {!isLoading ? (
        <div className="flex items-center flex-col">
          {data.photos.length ? (
            <div className="w-full">
              <div className="flex flex-wrap border-l-2 border-t-2 border-dashed border-slate-400 w-full">
                {Array(Math.ceil(data.photos.length / gridCol) * gridCol)
                  .fill(null)
                  .map((photo, index) => (
                    <div
                      className={` border-r-2 border-b-2 border-dashed border-slate-400 p-[5px]`}
                      style={{
                        width: Math.round((100 / gridCol) * 100) / 100 + "%",
                      }}
                      key={index}
                    >
                      {data.photos[index] && (
                        <div
                          className="pb-[100%] relative group cursor-pointer overflow-hidden"
                          box-wrap=""
                        >
                          <img
                            src={data.photos[index]?.src.large}
                            className="absolute-center w-full h-full object-cover transition duration-700 group-hover:scale-[1.15]"
                            onClick={handleEnlarge}
                            img-id={data.photos[index]?.id}
                            alt={data.photos[index].alt}
                          />
                          <div className="flex absolute bottom-3 right-2 p-[10px] opacity-0 transition duration-500 group-hover:opacity-100 flex-col gap-3 max-[840px]:gap-1 max-[840px]:right-1 max-[840px]:bottom-1">
                            <div
                              className="opacity-75 hover:opacity-100 transition-all"
                              onClick={handleModalOpen}
                            >
                              <FontAwesomeIcon
                                icon={faHeart}
                                size="lg"
                                color="#f9f9f9"
                              />
                            </div>
                            <div
                              className="opacity-75 hover:opacity-100 transition-all"
                              onClick={handleDownload}
                            >
                              <FontAwesomeIcon
                                icon={faDownload}
                                size="lg"
                                color="#f9f9f9"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="flex px-3 justify-end">
                <Pagination
                  totalPages={searchMemo.allPages}
                  event={paginationHandler}
                />
              </div>
            </div>
          ) : (
            <div className="text-lg text-zinc-700 text-center py-[60px]">
              <NoResult text={keyword ?? ""} />
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
