import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const tabWidth = width / 2;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#333333',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 80 ,
          paddingBottom: 20,
          paddingTop: 20,
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        tabBarItemStyle: {
          flex: 1,
        },
      }}>
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              { width: tabWidth },
              focused && styles.iconContainerActive
            ]}>
              <Ionicons name="search" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              { width: tabWidth },
              focused && styles.iconContainerActive
            ]}>
              <Ionicons name="add-circle-outline" size={32} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: '#5FCCC4',
  },
});