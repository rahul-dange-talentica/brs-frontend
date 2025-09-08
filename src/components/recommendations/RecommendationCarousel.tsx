import React, { useRef, useState } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

export interface RecommendationCarouselProps {
  children: React.ReactNode;
  itemWidth?: number;
  gap?: number;
  showControls?: boolean;
  autoScroll?: boolean;
  className?: string;
}

export const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({
  children,
  itemWidth = 200,
  gap = 16,
  showControls = true,
  autoScroll = false,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Calculate scroll amount based on viewport
  const getScrollAmount = () => {
    if (!scrollContainerRef.current) return itemWidth;
    
    const containerWidth = scrollContainerRef.current.clientWidth;
    const itemsVisible = Math.floor(containerWidth / (itemWidth + gap));
    return itemsVisible * (itemWidth + gap);
  };

  // Check scroll position and update button states
  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Scroll left
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = getScrollAmount();
    scrollContainerRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  };

  // Scroll right
  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = getScrollAmount();
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  // Handle scroll event
  const handleScroll = () => {
    checkScrollButtons();
  };

  // Auto-scroll functionality
  React.useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      if (scrollLeft >= scrollWidth - clientWidth - 1) {
        // Reset to beginning
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRight();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  // Initialize scroll button states
  React.useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);

    return () => clearTimeout(timer);
  }, [children]);

  const childrenArray = React.Children.toArray(children);
  const adaptiveItemWidth = isMobile ? Math.min(itemWidth, 160) : itemWidth;

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Left scroll button */}
      {showControls && canScrollLeft && (
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: 4,
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      {/* Right scroll button */}
      {showControls && canScrollRight && (
        <IconButton
          onClick={scrollRight}
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: 4,
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}

      {/* Scrollable container */}
      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          gap: `${gap}px`,
          px: showControls ? 3 : 0,
          py: 1,
          // Hide scrollbar
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          // Add momentum scrolling on iOS
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {childrenArray.map((child, index) => (
          <Box
            key={index}
            sx={{
              flexShrink: 0,
              width: adaptiveItemWidth,
            }}
          >
            {child}
          </Box>
        ))}
      </Box>

      {/* Scroll indicators for mobile */}
      {isMobile && childrenArray.length > 2 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0.5,
            mt: 1,
          }}
        >
          {Array.from({ length: Math.ceil(childrenArray.length / 2) }).map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'divider',
                opacity: 0.5,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
