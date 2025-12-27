import { VehicleCard } from '@/components/common/VehicleCard';
import { storageService } from '@/services/storageService';
import { Vehicle } from '@/types/vehicle';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SearchTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadVehicles();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadVehicles();
    }, [])
  );

  useEffect(() => {
    filterVehicles();
  }, [searchQuery, vehicles]);

  const loadVehicles = async () => {
    const data = await storageService.loadVehicles();
    setVehicles(data);
  };

  const filterVehicles = () => {
    if (!searchQuery.trim()) {
      setFilteredVehicles(vehicles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = vehicles.filter(v =>
      v.licensePlate.toLowerCase().includes(query)
    );
    setFilteredVehicles(filtered);
  };

  const handleVehiclePress = (vehicle: Vehicle) => {
    router.push({
      pathname: '/screens/detail',
      params: { vehicleId: vehicle.id },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>車輛管理</Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="AAA - 1234"
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Text style={styles.searchIconText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {filteredVehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? '未找到相關車輛' : '暫無車輛資料'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredVehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VehicleCard vehicle={item} onPress={() => handleVehiclePress(item)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
  },
  content: {
    flex: 1,
    // padding: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -15 }],
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconText: {
    fontSize: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
});
