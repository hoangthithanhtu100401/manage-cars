import { apiGet } from "@/services/api";
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import { vehicleService } from "@/services/vehicleService";
import { Vehicle } from '@/types/vehicle';
import { formatDateYMD, formatDateYMDH } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {buildVehicleDateLabel} from '@/utils/dateUtils';

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
  const rawLastIn = v.lastIn ?? "";
const rawLastOut = v.lastOut ?? "";

const lastInDate = rawLastIn ? formatDateYMDH(rawLastIn) : "";
const lastOutDate = rawLastOut ? formatDateYMDH(rawLastOut) : "";

const lastIn = lastInDate ? `IN ${lastInDate}` : "";
const lastOut = lastOutDate ? `OUT ${lastOutDate}` : "";

const date = v.status === "IN" ? lastIn : lastOut;
  return {
    id: String(v.id),
    licensePlate: v.plateNumber,
    name: v.ownerName,
    phone: v.phone,
    lastIn,
    lastOut,
    status: v.status,
    date,
    createdAt: v.createdAt ? formatDateYMD(v.createdAt) : "",
  } as Vehicle;
};

const VehicleItemNew = ({
  item,
  onPress,
  onToggleStatus,
  toggling,
}: {
  item: Vehicle;
  onPress: () => void;
  onToggleStatus: () => void;
  toggling: boolean;
}) => {
  const isStatusIn = item.status === "IN";
  const nextStatus = isStatusIn ? "OUT" : "IN";

  const cardBackgroundColor = isStatusIn ? "#B6E4DA" : "#FFA6AC";
  const buttonBackgroundColor = nextStatus === "OUT" ? "#FF8B9A" : "#5CC6BA";
  const cardBorderColor = isStatusIn ? "#5CC6BA" : "#FF538F";
  const textColor = isStatusIn ? "#374441" : "#FFFFFF";
  const buttonText = nextStatus;
  const iconName = nextStatus === "OUT" ? "arrow-up-outline" : "arrow-down-outline";

  return (
    <View style={[styles.cardItem, { backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }]}>
      <Pressable style={styles.cardInfo} onPress={onPress}>
        <Text style={[styles.cardTitle, { color: textColor }]}>{item.licensePlate}</Text>
        <Text style={[styles.cardSubtitle, { color: textColor }]}>{item.name}</Text>
        <Text style={[styles.cardMeta, { color: textColor }]}>{item.date}</Text>
      </Pressable>

      <Pressable
        disabled={toggling}
        onPress={onToggleStatus}
        style={({ pressed }) => [
          styles.statusButton,
          { backgroundColor: buttonBackgroundColor, opacity: toggling ? 0.6 : pressed ? 0.9 : 1 },
        ]}
      >
        <Ionicons name={iconName as any} size={18} color="#FFFFFF" />
        <Text style={styles.statusText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
};

export default function SearchTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const focusColor = isSearchFocused ? "#000000" : "#8C8C8C";

  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ✅ Settings / Logout
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const loadVehiclesFromLocal = async () => {
    try {
      const data = await storageService.loadVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Error loading vehicles from local:", error);
    }
  };

  const syncVehiclesFromApi = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const auth = await authService.getAuth();
      const token = auth?.token;
      if (!token) {
        router.replace("/login");
        return;
      }
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

  const nowIso = new Date().toISOString();
    setTogglingId(vehicle.id);

    setVehicles((prev) =>
    prev.map((v) => {
      if (v.id !== vehicle.id) return v;

      const nextLastIn =  next === "IN" ? nowIso : v.lastIn;
      const nextLastOut = next === "OUT" ? nowIso : v.lastOut;

      return {
        ...v,
        status: next,
        lastIn: nextLastIn,
        lastOut: nextLastOut,
        date: buildVehicleDateLabel(next, nextLastIn, nextLastOut),
      };
    })
  );

    try {
      await storageService.updateVehicleStatus(vehicle.id, next);

      const auth = await authService.getAuth();
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

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      router.replace("/login");
  }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeftPlaceholder} />
          <View style={styles.headerCenterPlaceholder} />
          <Pressable
            onPress={() => setSettingsVisible(true)}
            style={({ pressed }) => [styles.headerIconBtn, pressed && { opacity: 0.85 }]}
            hitSlop={10}
          >
            <Ionicons name="person-outline" size={30} color="#5CC6BA" />
          </Pressable>
        </View>

        {/* Search bar */}
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

        {/* List */}
        <Animated.View style={[styles.listWrapper, { opacity: fadeAnim }]}>
          {filteredVehicles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? "未找到車輛" : "尚無車輛資料"}
              </Text>
              {!!apiError && <Text style={styles.emptyHint}>{apiError}</Text>}
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

      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSettingsVisible(false)}>
          <Pressable style={styles.settingsCard} onPress={() => {}}>
            <Pressable
              style={({ pressed }) => [styles.settingsItem, pressed && { opacity: 0.85 }]}
              onPress={() => {
                setSettingsVisible(false);
                setLogoutConfirmVisible(true);
              }}
            >
              <Ionicons name="log-out-outline" size={30} color="#FE6262" />
              <Text style={styles.settingsItemText}>登出</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Logout confirm modal */}
      <Modal
        visible={logoutConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutConfirmVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconWrap}>
              <Ionicons name="help" size={30} color="#FE6262" />
            </View>
            <Text style={styles.confirmTitle}>確定要登出嗎？</Text>

            <View style={styles.confirmBtnsRow}>
              <Pressable
                style={({ pressed }) => [styles.confirmBtn, pressed && { opacity: 0.9 }]}
                onPress={() => setLogoutConfirmVisible(false)}
              >
                <Text style={styles.confirmBtnText}>取消</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.confirmBtn, pressed && { opacity: 0.9 }]}
                onPress={async () => {
                  setLogoutConfirmVisible(false);
                  await handleLogout();
                }}
              >
                <Text style={styles.confirmBtnPrimaryText}>登出</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeftPlaceholder: { width: 30, height: 30 },
  headerCenterPlaceholder: { flex: 1 },
  headerIconBtn: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  // Search
  searchSection: { marginBottom: 16, marginTop: 20 },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    height: 40,
    fontWeight: "500",
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  // List wrapper
  listWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listContent: { padding: 10 },

  // Card
  cardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardInfo: { flex: 1, justifyContent: "center" },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  cardSubtitle: { fontSize: 14 },
  cardMeta: { fontSize: 12, opacity: 0.85, marginTop: 4 },

  statusButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },

  // Empty state
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 },
  emptyText: { fontSize: 16, color: "#999" },
  emptyHint: { fontSize: 12, color: "#999", marginTop: 8 },

  // ✅ Settings modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 62,
    paddingRight: 14,
  },
  settingsCard: {
    height: 86,
    width: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
      flexDirection: "column",

  },
  settingsTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
  },
  settingsItem: {
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 12,
  paddingHorizontal: 6,
  borderRadius: 10,
},
settingsItemText: {
  fontSize: 16,
  color: "#111",
  fontWeight: "600",
  marginTop: 8,
},

  // ✅ Confirm modal
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  confirmCard: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  confirmIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#FE6262",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    opacity: 0.9,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },
  confirmBtnsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  confirmBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  confirmBtnText: { fontSize: 16, fontWeight: "700", color: "#111" },

  confirmBtnPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  confirmBtnPrimaryText: {fontSize: 16, fontWeight: "700", color: "#FE6262" }
});
