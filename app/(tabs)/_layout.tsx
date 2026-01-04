import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
<Tabs
      screenOptions={{
        // 1. MÀU SẮC & STYLE CƠ BẢN
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF', // Màu icon/text khi chọn
        tabBarInactiveTintColor: '#333333', // Màu icon/text khi KHÔNG chọn
        
        // 2. XỬ LÝ MÀU NỀN (Quan trọng: Dùng thuộc tính có sẵn thay vì custom View)
        tabBarActiveBackgroundColor: '#5FCCC4', 
        tabBarInactiveBackgroundColor: '#FFFFFF', 

        // 3. STYLE CHO THANH TAB
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 70,
          // Đảm bảo padding bằng 0 để màu nền tràn viền
          paddingBottom: 0, 
          paddingTop: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14, // Giảm một chút cho cân đối
          fontWeight: '500',
          marginBottom: 10, // Căn chỉnh label cách đáy một chút
        },
        // Bỏ padding mặc định để màu nền phủ kín nút
        tabBarItemStyle: {
           padding: 0,
           margin: 0,
        },
      }}>

        <Tabs.Screen
          name="search"
          options={{
            title: '搜尋',
            // Code icon giờ rất gọn, không cần View bao bọc
            tabBarIcon: ({ color }) => (
              <Ionicons name="search" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            title: '新增',
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={32} color={color} />
            ),
          }}
        />

      {/* Các màn hình ẩn */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
    </SafeAreaView>

  );
}

