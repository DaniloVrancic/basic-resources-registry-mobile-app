import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Locations from './(tabs)/locations';



const Stack = createStackNavigator();

const AppNavigator = () => {
    const LocationMap = require('@/components/LocationMap');

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LocationList">
                <Stack.Screen name="Locations" component={Locations} options={{ title: 'Locations' }} />
                <Stack.Screen name="LocationMap" component={LocationMap} options={{title: 'Location Map'}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;