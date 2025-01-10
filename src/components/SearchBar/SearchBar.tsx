"use client;";

import { useState, useEffect, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { SearchProp } from "@/types";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

const SearchBar = ({
  event,
  defaultValue,
  placeholder,
}: {
  event: (value: string) => void;
  defaultValue?: string;
  placeholder: string;
}) => {
  const [input, setInput] = useState("");
  const [intro, setIntro] = useState(true);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  const onSearch = () => {
    input && event(input);
    !intro && setIntro(false);
  };

  const keyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" ? onSearch() : "";
  };

  useEffect(() => {
    if (defaultValue) {
      setInput(defaultValue);
      setIntro(false);
    }
  }, [defaultValue]);

  return (
    <div className="text-center mb-[50px] max-[840px]:mt-[0] max-[840px]:mb-[40px]">
      <div
        className={`flex justify-center items-center overflow-hidden transition-all duration-500 ${!intro ? "h-0 opacity-0" : "h-[80px] opacity-1"}`}
      >
        <p
          className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-600 max-[840px]:text-2xl`}
        >
          Please input any keyword of your search.
        </p>
      </div>
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
        />
        <div
          className="w-[40px] h-[40px] flex justify-center items-center relative max-[840px]:w-[30px] max-[840px]:h-[30px] cursor-pointer"
          onClick={onSearch}
        >
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
