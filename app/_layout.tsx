import 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
  const router = useRouter();

  // Load any resources or data needed for the app
  const [fontsLoaded, fontError] = useFonts({
    // Add custom fonts here if needed
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  //TODO - remove this trick
  useEffect(() => {
    // Redirect from `/` to `/home`
    router.replace('/home');
  }, [router]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Drawer
          initialRouteName="home" // Set the default route to "home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerActiveTintColor: '#f4511e',
            drawerLabelStyle: {
              fontSize: 16,
            },
          }}
        >
          {/* Define the Home route explicitly */}
          <Drawer.Screen
            name="home"
            options={{
              drawerLabel: 'Home', // Set a user-friendly label
              title: 'My Home', // Set the title for the header
              drawerIcon: ({ color }: any) => (
                <Ionicons name="home" size={22} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="profile"
            options={{
              drawerLabel: 'Profile',
              title: 'My Profile',
              drawerIcon: ({ color }: any) => (
                <Ionicons name="person" size={22} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="setting"
            options={{
              drawerLabel: 'Settings',
              title: 'Settings',
              drawerIcon: ({ color }: any) => (
                <Ionicons name="settings" size={22} color={color} />
              ),
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
