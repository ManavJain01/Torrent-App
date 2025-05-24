import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Home">
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="About" component={AboutScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <View style={styles.container}>
      <Text>hello world</Text>

      <Button
        title="Go to Torrent Page"
        onPress={() => router.push('/(tabs)/torrent')}
      />

      <Button
        title="Go to Contact Page"
        onPress={() => router.push('/(tabs)/contact')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});