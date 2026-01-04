import { storageService } from '@/services/storageService';
import { Vehicle } from '@/types/vehicle';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vehicleService } from "@/services/vehicleService";
import { apiGet } from "@/services/api";
import { getToken } from "@/services/token";
import { authService } from '@/services/authService';
import { formatDateYMD } from '@/utils/dateUtils';

type VehicleApiItem = {
  id: number;
  plateNumber: string;
  licenseNumber: string;
  ownerName: string;
  phone: string;
  status: "IN" | "OUT";
  createdAt?: string;
  lastIn?: string;
  lastOut?: string;
};
type VehicleListResponse = {
  code: number;
  data: VehicleApiItem[];
  message: string;
};

const mapApiToVehicle = (v: VehicleApiItem): Vehicle => {
  return {
    id: String(v.id),
    licensePlate: v.plateNumber,
    name: v.ownerName,
    phone: v.phone,
    status: v.status,
    createdAt: formatDateYMD(v.createdAt),
  } as Vehicle;
};

const VehicleItemNew = ({ item, onPress, onToggleStatus, toggling, }: { item: Vehicle; onPress: () => void; onToggleStatus: () => void ;   toggling: boolean;}) => {
  const isStatusIn = item.status === 'IN';
  const nextStatus = isStatusIn ? "OUT" : "IN";


  const cardBackgroundColor = isStatusIn ? '#B6E4DA' : '#FFA6AC'; 
  const buttonBackgroundColor = nextStatus === "OUT" ? "#FF8B9A" : "#5CC6BA";
  const cardBorderColor= isStatusIn ? '#5CC6BA' : '#FF538F'; 
  const textColor = isStatusIn ? '#374441' : '#FFFFFF';
  const buttonText = nextStatus;
  const iconName = nextStatus === "OUT" ? "arrow-up-outline" : "arrow-down-outline";

  return (
    <View style={[styles.cardItem, { backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }]}>
      {/* vùng bấm mở detail */}
      <Pressable style={styles.cardInfo} onPress={onPress}>
        <Text style={[styles.cardTitle, { color: textColor }]}>{item.licensePlate}</Text>
        <Text style={[styles.cardSubtitle, { color: textColor }]}>{item.name}</Text>
      </Pressable>

      {/* vùng bấm đổi status */}
      <Pressable
        disabled={toggling}
        onPress={onToggleStatus}
        style={({ pressed }) => [
          styles.statusButton,
          { backgroundColor: buttonBackgroundColor, opacity: toggling ? 0.6 : pressed ? 0.9 : 1 },
        ]}
      >
        <Ionicons name={iconName} size={18} color="#FFFFFF" />
        <Text style={styles.statusText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
};

export default function SearchTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const focusColor = isSearchFocused ? "#000000" : "#8C8C8C";
  const [togglingId, setTogglingId] = useState<string | null>(null);


  const loadVehiclesFromLocal = async () => {
    try {
      const data = await storageService.loadVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Error loading vehicles from local:", error);
    }
  };
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

  const syncVehiclesFromApi = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const token = await getToken(); 
      const res = await apiGet<VehicleListResponse>("/api/v1/vehicle", token ?? undefined);

      if (res.code !== 0 || !Array.isArray(res.data)) {
        throw new Error(res.message || "Invalid API response");
      }

      const mapped = res.data.map(mapApiToVehicle);

      setVehicles(mapped);

      await storageService.saveVehicles(mapped);
    } catch (e: any) {
      console.error("LOAD VEHICLES API ERROR:", e);
      setApiError(e?.message || "Network request failed");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await loadVehiclesFromLocal();  
        await syncVehiclesFromApi();     

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      })();
    }, [])
  );


  // --- 2. LOGIC FILTER GỐC CỦA BẠN ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVehicles(vehicles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = vehicles.filter((v) => v.licensePlate.toLowerCase().includes(query));
      setFilteredVehicles(filtered);
    }
  }, [searchQuery, vehicles]);

  const handleVehiclePress = (vehicle: Vehicle) => {
    router.push({
      pathname: "/screens/detail",
      params: { vehicleId: vehicle.id },
    });
  };
  const handleToggleStatus = async (vehicle: Vehicle) => {
  if (togglingId === vehicle.id) return;

  const current = vehicle.status;
  const next: "IN" | "OUT" = current === "IN" ? "OUT" : "IN";

  setTogglingId(vehicle.id);

  setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? { ...v, status: next } : v)));

  try {
    await storageService.updateVehicleStatus(vehicle.id, next);

    const auth = await authService.getAuth(); // phải có userId + token
    const employeeId = auth?.userId;

    if (!employeeId) throw new Error("Missing employeeId (userId)");

    await vehicleService.updateStatus({
      vehicleId: Number(vehicle.id),
      employeeId: Number(employeeId),
      status: next,
    });
  } catch (err) {
    console.log("Update status failed:", err);

    setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? { ...v, status: current } : v)));
    await storageService.updateVehicleStatus(vehicle.id, current);
  } finally {
    setTogglingId(null);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="AAA - 1234"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <TouchableOpacity style={[styles.searchIconContainer, { borderColor: focusColor }]}>
              <Ionicons name="search" size={20} color={focusColor} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.listWrapper, { opacity: fadeAnim }]}>
          {filteredVehicles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? '未找到車輛' : '尚無車輛資料'}
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
                  onToggleStatus={() => handleToggleStatus(item)}
                  toggling={togglingId === item.id}

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