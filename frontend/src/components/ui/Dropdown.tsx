import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DropdownItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
}

export function Dropdown({ items, trigger }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      if (isOpen) {
        updatePosition();
      }
    }

    function handleResize() {
      if (isOpen) {
        updatePosition();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    setPosition({
      top: rect.bottom + scrollTop + 2,
      left: rect.right + scrollLeft - 224 // 224px = w-56 (14rem * 16px)
    });
  };

  const handleTriggerClick = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      className="fixed z-[9999] w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-100"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="py-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              setIsOpen(false);
            }}
            className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:scale-[1.02] transform duration-150 ${item.variant === 'danger'
              ? 'text-red-700 hover:bg-red-50 hover:text-red-900'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative inline-block text-left" ref={triggerRef}>
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {trigger}
      </div>
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
}