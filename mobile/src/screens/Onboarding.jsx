import {
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import { COLORS, SIZES, ONBOARDINGSLIDES } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles/onboarding.style.js";
import { OnboardingSlide } from "../components";

const Onboarding = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const ref = useRef(null);

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / SIZES.width);
    setCurrentSlide(currentIndex);
  };

  const nextSlide = () => {
    const nextSlide = currentSlide + 1;
    if (nextSlide != ONBOARDINGSLIDES.length) {
      const offset = nextSlide * SIZES.width;
      ref?.current?.scrollToOffset({ offset });
      setCurrentSlide(nextSlide);
    }
  };

  const skip = () => {
    const lastSlide = ONBOARDINGSLIDES.length - 1;
    const offset = lastSlide * SIZES.width;
    ref?.current?.scrollToOffset({ offset });
    setCurrentSlide(lastSlide);
  };

  const Footer = () => {
    return (
      <View style={styles.footer}>
        {/* Indicators */}
        <View style={styles.indicatorContainer}>
          {ONBOARDINGSLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlide == index && {
                  backgroundColor: COLORS.success,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>
        {currentSlide == ONBOARDINGSLIDES.length - 1 ? (
          <View style={{ height: 50, marginBottom: 20 }}>
            <TouchableOpacity
              style={[styles.btn]}
              onPress={() => navigation.replace("Landing")}
            >
              <Text style={[styles.btnText]}>GET STARTED</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: COLORS.success,
                  },
                ]}
                onPress={skip}
              >
                <Text style={[styles.btnText]}>SKIP</Text>
              </TouchableOpacity>
              <View style={{ width: 15 }}></View>
              <TouchableOpacity style={[styles.btn]} onPress={nextSlide}>
                <Text style={[styles.btnText]}>NEXT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.white} />
      <FlatList
        ref={ref}
        pagingEnabled
        onMomentumScrollEnd={updateCurrentSlideIndex}
        data={ONBOARDINGSLIDES}
        contentContainerStyle={{ height: SIZES.height * 0.75 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({ item }) => <OnboardingSlide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
};

export default Onboarding;
