import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <Text>homepage</Text>
    </View>
  )
}

/*
import { ThemedText } from '@/components/ThemedText';
import { Dimensions, SafeAreaView, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.HomePage}>
      <ThemedText style={styles.title}>Hello world</ThemedText>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  HomePage: {
    height: height,
    width: width,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 60
  }
});


*/