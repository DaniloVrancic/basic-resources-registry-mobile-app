import { Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';


import { TabBarIcon } from '../../components/navigation/TabBarIcon';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

import { connectToDatabase, createTables } from '@/db/db';

import { MY_DATABASE_NAME } from '@/constants/DatabaseInformation';
import { SQLiteProvider } from 'expo-sqlite';

import { useTranslation } from 'react-i18next';
import i18next from '@/services/i18next';



export default function TabLayout() {
  const colorScheme = useColorScheme();

  const {t} = useTranslation(); //Method for internationalization

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


let listOfAssetsName

  useEffect(() => {
 
    loadData();

    if (i18next.isInitialized) {
      
    } else {
      i18next.on('initialized', () => {
        
      });
    }
    
  }, [loadData])


  return (
    <SQLiteProvider databaseName={MY_DATABASE_NAME}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.fixedAssets'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="employees"
          options={{
            title: t('tabs.employees'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="locations"
          options={{
            title: t('tabs.locations'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'location' : 'location-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="list-of-assets"
          options={{
            title: t('tabs.listOfAssets'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'list-circle' : 'list-circle-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('tabs.settings'),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
      </SQLiteProvider>
  );
}


