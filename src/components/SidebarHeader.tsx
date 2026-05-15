import React from 'react';

export const SidebarHeader = ({ onToggle }: { onToggle?: () => void }) => {
  return (
    <div className="flex items-center justify-between px-2 pt-2  w-full">
      <button
        onClick={onToggle}
        aria-label="Hide sidebar"
        type="button"
        className="flex items-center justify-center w-[30px] h-[30px] rounded hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[18px] h-[18px]">
          <path fill="currentColor" d="M16.25 3.625c1.174 0 2.125.951 2.125 2.125v8.5a2.125 2.125 0 0 1-2.125 2.125H3.75a2.125 2.125 0 0 1-2.125-2.125v-8.5c0-1.174.951-2.125 2.125-2.125h12.5Zm-12.5 1.25a.875.875 0 0 0-.875.875v8.5c0 .483.392.875.875.875h2.7V4.875h-2.7Zm3.8 10.25h8.7a.875.875 0 0 0 .875-.875v-8.5a.875.875 0 0 0-.875-.875h-8.7v10.25Z"></path>
        </svg>
      </button>

      <div className="flex items-center gap-0.5">
        <button
          aria-label="Search"
          type="button"
          className="flex items-center justify-center w-[30px] h-[30px] rounded hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[18px] h-[18px]">
            <path fill="currentColor" d="M8.875 2.625a6.25 6.25 0 1 0 3.955 11.09l3.983 3.982a.625.625 0 1 0 .884-.884l-3.983-3.982a6.25 6.25 0 0 0-4.84-10.206Zm-5 6.25a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"></path>
          </svg>
        </button>

        <button
          aria-label="Edit"
          type="button"
          className="flex items-center justify-center w-[30px] h-[30px] rounded hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[18px] h-[18px]">
            <path fill="currentColor" d="m16.774 4.341-.59.589-1.109-1.11.596-.594a.784.784 0 0 1 1.103 0c.302.302.302.8 0 1.102v.013ZM8.65 12.462l6.816-6.813-1.11-1.11-6.822 6.808a1.081 1.081 0 0 0-.236.393l-.289.932c-.052.196.131.38.315.314l.932-.288a.882.882 0 0 0 .394-.236Z"></path>
            <path fill="currentColor" d="M4.375 6.25c0-1.036.84-1.875 1.875-1.875H11a.625.625 0 1 0 0-1.25H6.25A3.125 3.125 0 0 0 3.125 6.25v7.5c0 1.726 1.4 3.125 3.125 3.125h7.5c1.726 0 3.125-1.4 3.125-3.125V9a.625.625 0 1 0-1.25 0v4.75c0 1.036-.84 1.875-1.875 1.875h-7.5a1.875 1.875 0 0 1-1.875-1.875v-7.5Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
