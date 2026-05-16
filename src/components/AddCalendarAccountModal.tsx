import React, { useEffect, useState } from 'react';

interface AddCalendarAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCalendarAccountModal: React.FC<AddCalendarAccountModalProps> = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);
  const [render, setRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShow(true);
        });
      });
    } else {
      setShow(false);
      const timer = setTimeout(() => {
        setRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ease-out ${show ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`relative flex flex-col w-[420px] bg-white rounded-xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-[#E5E5E5] transform transition-all duration-300 ease-out px-6 py-5 ${show ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-[#a0a0a0] hover:text-[#37352F] transition-colors rounded p-1 hover:bg-neutral-100 flex items-center justify-center">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" style={{ width: "16px", height: "16px" }}>
              <path fill="currentColor" d="M12.642 3.358a.625.625 0 0 0-.884 0L8 7.116 4.242 3.358a.625.625 0 1 0-.884.884L7.116 8l-3.758 3.758a.625.625 0 0 0 .884.884L8 8.884l3.758 3.758a.625.625 0 1 0 .884-.884L8.884 8l3.758-3.758a.625.625 0 0 0 0-.884Z"></path>
            </svg>
          </div>
        </button>

        <div className="text-[16px] leading-[20px] font-semibold text-[#37352F] mb-1">Add Calendar account</div>
        <div className="text-[12px] leading-[16px] text-[#787774] mb-5">Manage your personal and work calendars all in one place</div>

        <div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={onClose}
              className="relative w-full h-[36px] border border-[#E5E5E5] hover:bg-[#F7F7F5] rounded-[6px] transition-colors"
            >
              <div className="flex items-center justify-center w-full h-full">
                <div className="absolute left-3 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.72 8.16c0-.497-.045-.975-.127-1.433H8v2.708h3.767a3.22 3.22 0 0 1-1.396 2.113v1.756h2.262c1.323-1.219 2.087-3.013 2.087-5.145Z" fill="#4285F4"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 15c1.89 0 3.475-.627 4.633-1.696l-2.262-1.756c-.627.42-1.43.668-2.37.668-1.824 0-3.367-1.231-3.918-2.886H1.745v1.814A6.997 6.997 0 0 0 8 15Z" fill="#34A853"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.083 9.33c-.14-.42-.22-.869-.22-1.33 0-.461.08-.91.22-1.33V4.856H1.745a6.997 6.997 0 0 0 0 6.288L4.083 9.33Z" fill="#FBBC05"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 3.784c1.028 0 1.95.353 2.676 1.047l2.008-2.008C11.472 1.693 9.887 1 8 1a6.997 6.997 0 0 0-6.255 3.856L4.083 6.67C4.633 5.015 6.177 3.784 8 3.784Z" fill="#EA4335"></path>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-[#37352F]">Connect Google Calendar</span>
              </div>
            </button>
            <button 
              onClick={onClose}
              className="relative w-full h-[36px] border border-[#E5E5E5] hover:bg-[#F7F7F5] rounded-[6px] transition-colors"
            >
              <div className="flex items-center justify-center w-full h-full">
                <div className="absolute left-3 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }}>
                    <path fill="currentColor" d="M14.098 5.454c-.093.072-1.731.996-1.731 3.048 0 2.375 2.084 3.215 2.147 3.236-.01.05-.331 1.15-1.1 2.27-.684.986-1.4 1.97-2.487 1.97-1.088 0-1.368-.632-2.624-.632-1.224 0-1.66.652-2.655.652-.995 0-1.69-.912-2.488-2.032-.925-1.315-1.672-3.358-1.672-5.297 0-3.11 2.023-4.76 4.013-4.76 1.058 0 1.94.694 2.603.694.632 0 1.618-.736 2.821-.736.456 0 2.095.042 3.173 1.587ZM10.354 2.55c.498-.59.85-1.41.85-2.228 0-.114-.01-.23-.03-.322-.81.03-1.774.54-2.355 1.213-.456.518-.881 1.337-.881 2.168 0 .125.02.25.03.29.051.009.135.02.218.02.726 0 1.64-.486 2.168-1.14Z"></path>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-[#37352F]">Connect iCloud Calendar</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
