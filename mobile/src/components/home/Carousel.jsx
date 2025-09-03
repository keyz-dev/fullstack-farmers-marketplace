import { View, Image, Pressable, Dimensions } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { COLORS, CATEGORIES } from "../../constants";
import styles from "./styles/carousel.style.js";

const { width: screenWidth } = Dimensions.get("window");

const CarouselComponent = () => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextIndex = (currentIndex + 1) % CATEGORIES.length;
        carouselRef.current.scrollTo({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleImagePress = (index) => {
    console.warn(`image ${index} pressed`);
  };

  const renderCarouselItem = ({ item, index }) => {
    return (
      <Pressable
        style={styles.carouselItemContainer}
        onPress={() => handleImagePress(index)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
      </Pressable>
    );
  };

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {CATEGORIES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  index === currentIndex ? COLORS.primary : COLORS.secondary,
                opacity: index === currentIndex ? 1 : 0.5,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        ref={carouselRef}
        data={CATEGORIES}
        renderItem={renderCarouselItem}
        width={screenWidth}
        height={200}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        loop
        autoPlay={false}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setCurrentIndex(index)}
        style={styles.carousel}
      />
      {renderPaginationDots()}
    </View>
  );
};

export default CarouselComponent;
