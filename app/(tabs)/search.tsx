import { VehicleCard } from '@/components/common/VehicleCard'; // Nếu bạn muốn giữ lại component cũ để tham khảo
import { storageService } from '@/services/storageService';
import { Vehicle } from '@/types/vehicle';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const VehicleItemNew = ({ item, onPress }: { item: Vehicle; onPress: () => void }) => {
  const isStatusIn = item.status === 'IN';

  const cardBackgroundColor = isStatusIn ? '#FFA6AC' : '#B6E4DA'; 
  const buttonBackgroundColor = isStatusIn ? '#B6E4DA' : '#FFA6AC';
  const cardBorderColor= isStatusIn ? '#FF538F' : '#5CC6BA'; 
  const buttonText = isStatusIn ? 'IN' : 'OUT';
  const iconName = isStatusIn ? 'arrow-down-outline' : 'arrow-up-outline';

  return (
    <TouchableOpacity 
      style={[styles.cardItem, { backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.licensePlate}</Text>
        <Text style={styles.cardSubtitle}>{item.name}</Text>
      </View>

      <View style={[styles.statusButton, { backgroundColor: buttonBackgroundColor }]}>
        <Ionicons name={iconName} size={18} color="#FFFFFF" />
        <Text style={styles.statusText}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function SearchTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- 1. LOGIC DATA GỐC CỦA BẠN (ĐÃ KHÔI PHỤC) ---
  const loadVehicles = async () => {
    try {
      console.log('Loading vehicles from storage...');
      const data = await storageService.loadVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVehicles();
      // Animation fade-in mỗi khi focus vào màn hình
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Cleanup nếu cần (optional)
      return () => {
         // fadeAnim.setValue(0); // Nếu muốn reset animation khi blur
      };
    }, [])
  );

  // --- 2. LOGIC FILTER GỐC CỦA BẠN ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVehicles(vehicles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = vehicles.filter(v =>
        v.licensePlate.toLowerCase().includes(query)
      );
      setFilteredVehicles(filtered);
    }
  }, [searchQuery, vehicles]);

  const handleVehiclePress = (vehicle: Vehicle) => {
    router.push({
      pathname: '/screens/detail',
      params: { vehicleId: vehicle.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- GIAO DIỆN SEARCH BAR MỚI --- */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="AAA - 1234"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- GIAO DIỆN LIST CONTAINER MỚI --- */}
        <Animated.View style={[styles.listWrapper, { opacity: fadeAnim }]}>
          {filteredVehicles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Không tìm thấy xe' : 'Chưa có dữ liệu xe'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredVehicles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <VehicleItemNew 
                  item={item} 
                  onPress={() => handleVehiclePress(item)} 
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  // --- Style Search Bar ---
  searchSection: {
    marginBottom: 16,
    marginTop: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20, 
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    height: 40,
    fontWeight: '500',
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#333', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },

  // --- Style List Wrapper ---
  listWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    overflow: 'hidden', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listContent: {
    padding: 10,
  },

  // --- Style Item Card ---
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#ffffff',
  },
  statusButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },

  // --- Empty State ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});