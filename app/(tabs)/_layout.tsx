import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#333333",

        tabBarActiveBackgroundColor: "#5FCCC4",
        tabBarInactiveBackgroundColor: "#FFFFFF",

        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
          height: 78,              
          paddingTop: 8,          
          paddingBottom: 10,      
        },

        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "500",
          marginTop: 2,           
        },

        tabBarIconStyle: {
          marginTop: 2,            
        },

        tabBarItemStyle: {
          justifyContent: "center", 
        },
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: "搜尋",
          tabBarIcon: ({ color }) => <Ionicons name="search" size={26} color={color} />,
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "新增",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
