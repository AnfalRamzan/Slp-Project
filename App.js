import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ChildProvider } from './components/context/ChildContext';

// ✅ Screens
import SplashScreen from './components/screens/SplashScreen';
import LoginScreen from './components/screens/LoginScreen';
import HomeScreen from './components/screens/HomeScreen';
import AddChildScreen from './components/screens/AddChildScreen';
import CategoryListScreen from './components/screens/CategoryListScreen';
import CategoryDetailScreen from './components/screens/CategoryDetailScreen';
import LevelScreen from './components/screens/LevelScreen';
import SessionScreen from './components/screens/SessionScreen';
import ChildReportScreen from './components/screens/ChildReportScreen';
import ChildrenListScreen from './components/screens/ChildrenListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ChildProvider>
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
          <Stack.Screen 
            name="ChildrenList" 
            component={ChildrenListScreen} 
            options={{ title: 'Children Records' }}
          />
          <Stack.Screen 
            name="CategoryList" 
            component={CategoryListScreen} 
            options={{ title: 'Categories' }}
          />
          <Stack.Screen 
            name="CategoryDetail" 
            component={CategoryDetailScreen} 
            options={{ title: 'Goals' }}
          />
          <Stack.Screen 
            name="LevelScreen" 
            component={LevelScreen} 
            options={{ title: 'Level Details' }}
          />
          <Stack.Screen 
            name="SessionScreen" 
            component={SessionScreen} 
            options={{ title: 'Session' }}
          />
          <Stack.Screen 
            name="ChildReport" 
            component={ChildReportScreen} 
            options={{ title: 'Child Report' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ChildProvider>
  );
}