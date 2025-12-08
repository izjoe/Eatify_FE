import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component tự động scroll lên đầu trang khi route thay đổi
 * Chỉ scroll khi đi tới trang mới (forward navigation)
 * Không scroll khi back (để giữ lại vị trí cũ)
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Chỉ scroll khi navigation type là PUSH (đi tới)
    // Không scroll khi POP (back/forward browser)
    const navigationType = window.performance?.getEntriesByType?.('navigation')?.[0]?.type;
    
    if (navigationType !== 'back_forward') {
      // Scroll ngay lập tức không có hiệu ứng
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Không có smooth animation
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
