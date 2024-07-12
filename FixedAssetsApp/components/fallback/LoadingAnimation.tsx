import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Easing } from 'react-native-reanimated';

interface LoadingAnimationProps {
  text: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ text }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { transform: [{ rotate: spin }] }]} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: 'gray',
    borderTopColor: 'blue',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: 'black',
  },
});

export default LoadingAnimation;