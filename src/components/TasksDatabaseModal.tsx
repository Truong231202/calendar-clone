import React, { useEffect, useState } from 'react';

interface TasksDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TasksDatabaseModal: React.FC<TasksDatabaseModalProps> = ({ isOpen, onClose }) => {
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
      }, 300); // match duration
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
        className={`flex w-[880px] h-[540px] bg-white rounded-2xl overflow-hidden shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-[#E5E5E5] transform transition-all duration-300 ease-out ${show ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side */}
        <div className="w-[440px] p-8 flex flex-col h-full bg-white">
          <h2 className="text-[22px] font-semibold text-[#37352F] mb-2.5">
            Manage tasks directly in Calendar
          </h2>
          <p className="text-[15px] text-[#787774] mb-8 leading-[1.6]">
            Use databases directly in Notion Calendar. Easily track upcoming tasks and important deadlines.
          </p>
          
          <div className="flex flex-col gap-4 border border-[#E5E5E5] rounded-xl p-5 mb-auto bg-[#F7F7F5]">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#EBEBEA] text-[#787774] flex items-center justify-center text-[13px] font-medium shrink-0 mt-0.5">
                1
              </div>
              <p className="text-[15px] text-[#37352F] leading-snug">Edit Notion pages directly in Calendar</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#EBEBEA] text-[#787774] flex items-center justify-center text-[13px] font-medium shrink-0 mt-0.5">
                2
              </div>
              <p className="text-[15px] text-[#37352F] leading-snug">Manage your most important tasks</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#EBEBEA] text-[#787774] flex items-center justify-center text-[13px] font-medium shrink-0 mt-0.5">
                3
              </div>
              <p className="text-[15px] text-[#37352F] leading-snug">Add properties such as status, priority, and due date to your most important tasks</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2.5">
            <button className="w-full h-10 bg-[#2383E2] hover:bg-[#1A73CC] text-white rounded-[8px] font-medium text-[14px] transition-colors flex items-center justify-center shadow-sm">
              Create new tasks database
            </button>
            <button 
              onClick={onClose} 
              className="w-full h-10 bg-transparent hover:bg-[#F1F1EF] border border-[#E5E5E5] text-[#37352F] rounded-[8px] font-medium text-[14px] transition-colors flex items-center justify-center"
            >
              Maybe later
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 bg-white p-3 pl-0 flex flex-col">
          {/* Blue Background Container - Inset and rounded on all corners */}
          <div className="flex-1 w-full h-full bg-[#EBF3FF] rounded-2xl relative overflow-hidden border border-[#E5E5E5]">
             {/* The dark mockup image, inset to show the blue background */}
             <img 
               src="/tasks-preview.png" 
               alt="Mockup" 
               className="absolute top-10 left-10 w-[500px] h-auto rounded-tl-[12px] shadow-[-16px_16px_60px_rgb(0,0,0,0.15)] object-cover object-left-top bg-white" 
             />
          </div>
        </div>
      </div>
    </div>
  );
};
