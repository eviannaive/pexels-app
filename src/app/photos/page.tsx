"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useEffect, useState, useRef } from "react";
import axios from "axios";
import useSWR from "swr";

import Image from "next/image";
import Pagination from "@/components/Pagination";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import downloadImg from "@/lib/downloadImage";
import useSearchProps from "@/lib/useSearchProps";

// context
// import { useModalContext } from "@/context/ModalContext"
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
  const stores = useModalStore((state) => state);
  const { modalOpen, setModalType, setSelectImg } = stores;

  const perPage = 12;

  const randomKeyword = useMemo(() => {
    const item = demoList[Math.floor(Math.random() * demoList.length)];
    return item;
  }, []);

  const [enlargeShow, setEnlargeShow] = useState(false);
  const [winSize, setWinSize] = useState({
    width: 0,
    height: 0,
  });
  const [gridCol, setGridCol] = useState(4);
  const queryDetect = useRef(false);
  const [keyword, setKeyword] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const { data, error, isLoading } = useSWR(
    queryDetect.current
      ? `https://api.pexels.com/v1/search?query=${keyword || randomKeyword}&per_page=${perPage}&page=${page}`
      : null,
    (url: string) => {
      return axios
        .get(url, {
          headers: {
            Authorization: pexelsKey,
          },
        })
        .then((res) => res.data);
    },
    {
      revalidateOnFocus: false,
    },
  );

  const totalPage = useMemo(() => {
    return Math.ceil(data?.total_results / perPage);
  }, [data?.total_results]);

  const searchDefaultMomo = useMemo(() => {
    return keyword ? { defaultValue: keyword } : {};
  }, [queryDetect.current]);

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

  const { setSearchProps } = useSearchProps();

  useEffect(() => {
    findBreakpoints();
    window.addEventListener("resize", () => {
      setWinSize(windowResize());
      findBreakpoints();
    });

    return () => {
      setWinSize(windowResize());
    };
  }, []);

  useEffect(() => {
    console.log("first");
    const query = searchParams.get("query");
    const page = searchParams.get("page");
    query && setKeyword(query);
    page && setPage(Number(page));
    queryDetect.current = true;
  }, []);

  useEffect(() => {
    if (queryDetect.current) {
      console.log("update params", keyword, page);
      keyword && setSearchProps("query", keyword);
      page && setSearchProps("page", page);
    }
  }, [keyword, page]);

  return (
    <div className="pt-[50px] pb-[80px] px-[40px] max-w-[1500px] mx-auto max-[840px]:px-[20px] max-[840px]:pb-[60px]">
      <Enlarge
        state={enlargeShow}
        setEnlargeShow={setEnlargeShow}
        eventLike={handleModalOpen}
      />
      <SearchBar
        event={(value) => {
          setKeyword(value);
          setPage(1);
        }}
        placeholder={randomKeyword ?? ""}
        {...searchDefaultMomo}
      />
      {(!queryDetect.current || isLoading) && <LoadingFull />}
      {!isLoading && queryDetect.current && (
        <div className="flex items-center flex-col">
          {data && data.photos.length ? (
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
                {data && (
                  <Pagination
                    totalPages={totalPage}
                    currentPage={page}
                    prevLink={data.prev_page}
                    nextLink={data.next_page}
                    onChange={setPage}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-lg text-zinc-700 text-center py-[60px]">
              <NoResult text={keyword ?? ""} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
