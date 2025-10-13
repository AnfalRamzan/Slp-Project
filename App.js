import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ✅ Screens
import SplashScreen from './components/screens/SplashScreen';
import LoginScreen from './components/screens/LoginScreen';
import HomeScreen from './components/screens/HomeScreen';
import AddChildScreen from './components/screens/AddChildScreen';
import GoalTrackingScreen from './components/screens/GoalTrackingScreen';
import CategoryListScreen from './components/screens/CategoryListScreen';
import CategoryDetailScreen from './components/screens/CategoryDetailScreen';
import ReportScreen from './components/screens/ReportScreen';
import GoalCategoriesScreen from'./components/screens/GoalCategoriesScreen';
import CategoryGoalsScreen from'./components/screens/CategoryGoalsScreen';

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

        <Stack.Screen 
          name="CategoryList" 
          component={CategoryListScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="CategoryDetail" 
          component={CategoryDetailScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="GoalTracking" 
          component={GoalTrackingScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Report" 
          component={ReportScreen} 
          options={{ headerShown: false }} 
        />
<Stack.Screen name="GoalCategories" component={GoalCategoriesScreen} />
<Stack.Screen name="CategoryGoals" component={CategoryGoalsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
