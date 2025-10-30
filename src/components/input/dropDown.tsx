"use client";

import { DropDownProps } from "@/types/dropDownProps";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import React, { useState, useMemo } from "react";

export default function DropDown({
  label,
  placeholder,
  options = [],
  onChange,
  t,
  isRTL,
  ref,
  name,
  max_width = "max-w-xl",
  errors,
  value,
  searchable = false,
}: DropDownProps) {
  const [currentItem, setCurrentItem] = useState(value || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [showList, setShowList] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Update currentItem when value prop changes
  React.useEffect(() => {
    setCurrentItem(value || "");
  }, [value]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) {
      return options;
    }
    return options.filter((option) =>
      option.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleOptionSelect = (option: any) => {
    setCurrentItem(option.text);
    setShowList(false);
    setSearchTerm(""); // Clear search when option is selected
    setHighlightedIndex(-1);

    // Update the input value directly
    if (ref && ref.current) {
      ref.current.value = option.text;
    }

    if (onChange) {
      onChange(option.id);
    }
  };

  // Handle search input focus and selection
  const handleSearchFocus = () => {
    if (searchable && !showList) {
      setShowList(true);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!showList) {
          setShowList(true);
          return;
        }
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!showList) {
          setShowList(true);
          return;
        }
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (!showList) {
          setShowList(true);
          return;
        }
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        if (showList) {
          setShowList(false);
          setHighlightedIndex(-1);
          if (searchable) {
            setSearchTerm("");
          }
        }
        break;
      case " ":
        e.preventDefault();
        if (!showList) {
          setShowList(true);
        }
        break;
    }
  };

  // Reset highlighted index when search term changes
  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // Auto-scroll to highlighted item
  React.useEffect(() => {
    if (highlightedIndex >= 0) {
      const highlightedElement = document.querySelector(
        `[data-option-index="${highlightedIndex}"]`
      );
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showList) {
        const target = event.target as Element;
        if (!target.closest("[data-dropdown-container]")) {
          setShowList(false);
          setHighlightedIndex(-1);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showList]);

  return (
    <div
      className={`${max_width} w-full min-w-2xs shrink grow flex flex-col gap-2`}
      data-dropdown-container
    >
      <div className="font-work-sans text-neutral-600 font-normal px-4">
        {label}
      </div>
      <div
        className={`flex flex-row w-full justify-center items-center
      bg-white border rounded-full ${
        errors ? "border-red-500" : "border-neutral-200"
      }
        text-work-sans font-normal text-base relative cursor-pointer`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        onClick={() => setShowList(!showList)}
      >
        <input
          type="text"
          value={searchable && showList ? searchTerm : currentItem}
          placeholder={placeholder}
          readOnly={!searchable || !showList}
          ref={ref}
          name={name}
          className="appearance-none outline-none p-0 m-0 shadow-none 
         border-neutral-200 px-5 py-3 w-full
        text-work-sans font-normal text-base text-neutral-600 cursor-pointer"
          onChange={searchable && showList ? handleSearchChange : undefined}
          onFocus={handleSearchFocus}
          onClick={(e) => {
            if (searchable) {
              e.stopPropagation();
              if (!showList) {
                setShowList(true);
              }
            }
          }}
        />
        {/* Clear search button - only show when searching */}
        {searchable && showList && searchTerm && (
          <button
            className="px-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              clearSearch();
            }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          className="px-4"
          onClick={(e) => {
            e.stopPropagation();
            setShowList(!showList);
          }}
        >
          {!showList ? (
            <ChevronDown className="text-neutral-400" />
          ) : (
            <ChevronUp className="text-neutral-400" />
          )}
        </button>
        {showList && (
          <div
            className="absolute top-[101%] bg-white border-2 border-neutral-200 rounded-2xl w-full max-h-60
            text-work-sans font-normal text-base overflow-hidden z-10 shadow-lg"
          >
            {/* Options list */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isHighlighted =
                    searchable &&
                    searchTerm &&
                    option.text
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  const isKeyboardHighlighted = index === highlightedIndex;

                  return (
                    <div
                      className={`text-work-sans font-normal text-base px-5 py-4 w-full hover:bg-neutral-200 cursor-pointer transition-colors ${
                        isKeyboardHighlighted
                          ? "bg-primary-100 text-primary-700"
                          : isHighlighted
                          ? "text-primary-600 bg-primary-50"
                          : "text-neutral-700"
                      }`}
                      key={option.id}
                      data-option-index={index}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {searchable && searchTerm ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: option.text.replace(
                              new RegExp(`(${searchTerm})`, "gi"),
                              '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
                            ),
                          }}
                        />
                      ) : (
                        option.text
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-work-sans font-normal text-base text-gray-400 px-5 py-4 w-full text-center">
                  {searchable && searchTerm
                    ? "No matching options found"
                    : "No options available"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="h-6 flex items-start">
        {errors && (
          <div className="px-4 text-red-500 text-sm font-medium animate-in fade-in-0 slide-in-from-top-1 duration-200 leading-tight">
            {errors}
          </div>
        )}
      </div>
    </div>
  );
}
