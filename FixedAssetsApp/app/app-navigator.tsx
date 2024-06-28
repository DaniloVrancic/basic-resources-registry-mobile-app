import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocationMap from './(tabs)/location-map';
import Location from './(tabs)/location';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LocationList">
                <Stack.Screen name="Location" component={Location} options={{ title: 'Locations' }} />
                <Stack.Screen name="LocationMap" component={LocationMap} options={{ title: 'Location Map' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;