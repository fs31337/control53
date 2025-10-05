// src/hooks/useKonami.js
import { useEffect } from "react";

export function useKonami(callback) {
  useEffect(() => {
    const konami = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let position = 0;

    const handler = (e) => {
      if (e.key === konami[position]) {
        position++;
        if (position === konami.length) {
          callback();
          position = 0;
        }
      } else {
        position = 0;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callback]);
}
