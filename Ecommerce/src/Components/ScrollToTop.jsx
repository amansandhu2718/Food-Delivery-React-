import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Also scroll internal containers if they are the ones handling overflow
    const scrollableContainers = document.querySelectorAll('.content, .app, #root');
    scrollableContainers.forEach(container => {
      container.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
