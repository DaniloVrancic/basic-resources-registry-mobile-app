import { Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';


import { TabBarIcon } from '../../components/navigation/TabBarIcon';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

import { createStackNavigator } from '@react-navigation/stack';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { connectToDatabase, createTables } from '@/db/db';

import * as FileSystem from 'expo-file-system';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      if (!db) {
        throw new Error("Database connection returned null or undefined");
      }
      await createTables(db);
    } catch (error: any) {
      console.error(error.message);
      console.error(error.stack);
    }
  }, []);

  const findSystemPathMethod = async () => {
    console.log(FileSystem.documentDirectory)   
}

  useEffect(() => {
    loadData(),
    findSystemPathMethod();
  }, [loadData])

  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Fixed Assets',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="employees"
          options={{
            title: 'Employees',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="location"
          options={{
            title: 'Location',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'location' : 'location-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="list-of-assets"
          options={{
            title: 'List of Assets',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'list-circle' : 'list-circle-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
  );
}


