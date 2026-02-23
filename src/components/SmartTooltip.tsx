import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

interface SmartTooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  className?: string;
}

export const SmartTooltip = ({ children, content, className = "" }: SmartTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 256; // w-64 = 16rem = 256px
    const tooltipHeight = 100; // Estimated height for decision making
    const gap = 12; // Gap between element and tooltip
    const padding = 12; // Screen edge padding

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newStyle: React.CSSProperties = {
      position: 'fixed',
      width: '16rem', // w-64
      zIndex: 9999,
    };
    
    let newArrowStyle: React.CSSProperties = {
        position: 'absolute',
        width: '12px',
        height: '12px',
        backgroundColor: '#0f172a', // slate-900
        transform: 'rotate(45deg)',
        zIndex: 0,
    };

    // Vertical Logic
    let newPlacement: 'top' | 'bottom' = 'top';
    
    // Check if enough space on top
    if (rect.top < tooltipHeight + gap + padding) {
      // Not enough space above, go below
      newPlacement = 'bottom';
      newStyle.top = `${rect.bottom + gap}px`;
      newStyle.bottom = 'auto';
      
      // Arrow points up (at top of tooltip)
      newArrowStyle.top = '-6px';
      newArrowStyle.borderLeft = '1px solid rgba(255, 255, 255, 0.1)';
      newArrowStyle.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
    } else {
      // Go above
      newPlacement = 'top';
      newStyle.bottom = `${viewportHeight - rect.top + gap}px`;
      newStyle.top = 'auto';
      
      // Arrow points down (at bottom of tooltip)
      newArrowStyle.bottom = '-6px';
      newArrowStyle.borderRight = '1px solid rgba(255, 255, 255, 0.1)';
      newArrowStyle.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    }

    // Horizontal Logic
    // Center horizontally
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Clamp left
    if (left < padding) {
      left = padding;
    }
    // Clamp right
    else if (left + tooltipWidth > viewportWidth - padding) {
      left = viewportWidth - padding - tooltipWidth;
    }

    newStyle.left = `${left}px`;
    
    // Calculate arrow position relative to tooltip
    // Arrow should point to center of trigger
    const triggerCenter = rect.left + rect.width / 2;
    let arrowLeft = triggerCenter - left - 6; // -6 for half arrow width (12px)

    // Clamp arrow within tooltip (border radius approx 16px)
    if (arrowLeft < 16) arrowLeft = 16;
    if (arrowLeft > tooltipWidth - 16 - 12) arrowLeft = tooltipWidth - 16 - 12;

    newArrowStyle.left = `${arrowLeft}px`;

    setStyle(newStyle);
    setArrowStyle(newArrowStyle);
    setPlacement(newPlacement);
  };

  const handleMouseEnter = () => {
    calculatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  
  // Update position on scroll/resize
  useEffect(() => {
    if (isVisible) {
      const handleUpdate = () => {
          calculatePosition();
      };
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);
      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isVisible]);

  if (!content) return <>{children}</>;

  return (
    <>
      <div 
        className={className} 
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: placement === 'top' ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={style}
              className="pointer-events-none"
            >
                <div className="relative p-4 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] text-center">
                    <div className="text-xs text-slate-300 font-medium leading-relaxed relative z-10">
                        {content}
                    </div>
                    <div style={arrowStyle} />
                </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
