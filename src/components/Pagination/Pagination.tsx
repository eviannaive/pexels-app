"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { Dispatch, SetStateAction } from "react";

const Pagination = ({
  totalPages,
  currentPage,
  prevLink,
  nextLink,
  onChange,
}: {
  totalPages: number;
  currentPage: number;
  prevLink?: string;
  nextLink?: string;
  onChange: Dispatch<SetStateAction<number>>;
}) => {
  const refInput = useRef<HTMLInputElement>(null);
  const keyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" ? "" : "";
  };
  return (
    <div className="flex items-center mt-[50px] text-slate-800">
      {currentPage === 1 ? (
        ""
      ) : (
        <div className="flex">
          <div
            className="cursor-pointer"
            onClick={() => {
              onChange(1);
            }}
          >
            1
          </div>
          <div className="mx-2">...</div>
        </div>
      )}
      {prevLink ? (
        <FontAwesomeIcon
          icon={faAngleLeft}
          color="#373939"
          className="p-2 cursor-pointer"
          onClick={() => {
            onChange(currentPage - 1);
          }}
        />
      ) : (
        ""
      )}
      <input
        type="text"
        onChange={(e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, "");
        }}
        maxLength={3}
        className="w-10 mr-2 p-1 text-center transition-all placeholder:text-slate-500 focus:placeholder:text-white focus-visible:outline-slate-500"
        placeholder={String(currentPage)}
        ref={refInput}
        onKeyDown={keyPress}
      />
      <div
        className="w-[30px] h-[30px] rounded-full bg-orange-100  text-orange-400 flex justify-center items-center text-sm cursor-pointer"
        onClick={() => {
          const page = Number(refInput.current?.value);
          if (page <= totalPages) {
            onChange(page);
          } else {
            refInput.current!.value = String(currentPage);
          }
        }}
      >
        Go
      </div>
      {nextLink ? (
        <FontAwesomeIcon
          icon={faAngleRight}
          color="#373939"
          className="p-2 cursor-pointer"
          onClick={() => {
            onChange(currentPage + 1);
          }}
        />
      ) : (
        ""
      )}
      {currentPage === totalPages ? (
        ""
      ) : (
        <div className="flex">
          <div className="mx-2">...</div>
          <div
            className="cursor-pointer"
            onClick={() => {
              onChange(totalPages);
            }}
          >
            {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;
