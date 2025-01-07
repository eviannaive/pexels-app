"use client;";

import { useState, useEffect } from "react";

import { useSearchContext } from "@/context/searchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  ChangeEvent,
  KeyboardEvent,
  KeyboardEventHandler,
  Dispatch,
  SetStateAction,
} from "react";

const SearchBar = ({
  event,
  defaultValue,
  placeholder,
}: {
  event: Dispatch<SetStateAction<string | undefined>>;
  defaultValue?: string;
  placeholder: string;
}) => {
  const [input, setInput] = useState("");
  const [intro, setIntro] = useState(true);
  let {
    initFetch,
    inputRef,
    searchBtnShow,
    setSearchBtnShow,
    setInputValue,
    isPending,
    startTransition,
  }: any = useSearchContext();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  const onSearch = () => {
    input && event(input);
  };

  const keyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" ? onSearch() : "";
  };

  useEffect(() => {
    if (defaultValue) {
      setInput(defaultValue);
      setIntro(false);
    }
  }, []);

  return (
    <div className="text-center mb-[50px] max-[840px]:mt-[0] max-[840px]:mb-[40px]">
      {intro && (
        <div
          className={`flex justify-center items-center overflow-hidden transition-all duration-500 ${!intro ? "h-0 opacity-0" : "h-[80px] opacity-1"}`}
        >
          <p
            className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-600 max-[840px]:text-2xl`}
          >
            Please input any keyword of your search.
          </p>
        </div>
      )}
      <label
        className={`bg-white rounded-50px inline-flex items-center py-[6px] px-[8px] text-lg border-0 w-full max-w-[400px] max-[840px]:px-[5px] max-[840px]:py-[4px] `}
      >
        <input
          type="text"
          value={input}
          placeholder={`${placeholder} ...`}
          className="bg-white/0 focus:outline-none text-slate-700 font-medium grow px-4 max-[840px]:text-base"
          onChange={onChange}
          onKeyDown={keyPress}
          ref={inputRef}
        />
        <div
          className="w-[40px] h-[40px] flex justify-center items-center relative max-[840px]:w-[30px] max-[840px]:h-[30px] cursor-pointer"
          onClick={onSearch}
        >
          {/* <div
            className={`w-full h-full bg-rose-100 rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] scale-0 transition-transform duration-500  ${intro ? "scale-100" : ""}`}
          ></div> */}
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            color="#28ad80"
            className="relative z-10 pointer-events-none"
          />
        </div>
      </label>
    </div>
  );
};

export default SearchBar;
