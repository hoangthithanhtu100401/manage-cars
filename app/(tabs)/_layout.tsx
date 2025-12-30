import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
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

        // 4. TẮT HIỆU ỨNG RIPPLE/HIGHLIGHT (Sửa lỗi "sai sai" khi bấm)
        // tabBarButton: (props) => (
        //   <Pressable
        //     {...props}
        //     android_ripple={null} 
        //     style={({ pressed }) => [
        //       props.style,
        //       pressed ? { opacity: 0.8 } : null, 
        //     ]}
        //   />
        // ),
      }}>

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          // Code icon giờ rất gọn, không cần View bao bọc
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={32} color={color} />
          ),
        }}
      />

      {/* Các màn hình ẩn */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

