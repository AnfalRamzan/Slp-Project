import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ✅ Screens
import SplashScreen from './components/screens/SplashScreen';
import LoginScreen from './components/screens/LoginScreen';
import HomeScreen from './components/screens/HomeScreen';
import AddChildScreen from './components/screens/AddChildScreen';
import CategoryListScreen from './components/screens/CategoryListScreen';
import CategoryDetailScreen from './components/screens/CategoryDetailScreen';
import LevelScreen from './components/screens/LevelScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">

        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="AddChild" 
          component={AddChildScreen} 
          options={{ headerShown: false }} 
        />
<Stack.Screen name="CategoryList" component={CategoryListScreen} />
<Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
<Stack.Screen name="LevelScreen" component={LevelScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
