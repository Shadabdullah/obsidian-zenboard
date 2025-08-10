// TooltipPortal.tsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function TooltipPortal({
  children,
  targetRef,
}: {
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLElement>;
}) {
  const [style, setStyle] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
    setStyle({
      top: rect.top - 50 + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX,
    });
  }, [targetRef.current]);

  return createPortal(
    <div
      className="absolute z-50 bg-black text-white text-sm px-3 py-2 rounded shadow-md transform -translate-x-1/2"
      style={style}
    >
      {children}
    </div>,
    document.body,
  );
}
