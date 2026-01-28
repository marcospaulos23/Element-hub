import { useState, useEffect, useRef, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver<T extends Element>({
  threshold = 0,
  rootMargin = "100px",
  freezeOnceVisible = true,
}: UseIntersectionObserverOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already visible and we want to freeze, skip observer setup
    if (freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        
        if (visible) {
          setIsVisible(true);
          
          // If freezing once visible, disconnect immediately
          if (freezeOnceVisible) {
            observer.disconnect();
          }
        } else if (!freezeOnceVisible) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, freezeOnceVisible, isVisible]);

  return [ref, isVisible];
}
