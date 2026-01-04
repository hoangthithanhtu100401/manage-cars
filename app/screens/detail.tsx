import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { storageService } from "../../services/storageService";
import { Vehicle } from "../../types/vehicle";
import { vehicleService } from "@/services/vehicleService";
import { authService } from "@/services/authService";

const RED = "#FE6262";

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [changingStatus, setChangingStatus] = useState(false);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const vehicleId = Array.isArray(params.vehicleId) ? params.vehicleId[0] : params.vehicleId;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await loadVehicle();
      })();
    }, [vehicleId])
  );

  const loadVehicle = async () => {
    const vehicles = await storageService.loadVehicles();
    const found = vehicles.find((v) => v.id === String(vehicleId));
    if (found) setVehicle(found);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEdit = () => {
    if (vehicle) {
      router.push({
        pathname: "/screens/edit",
        params: { vehicleId: vehicle.id },
      });
    }
  };

  const handleStatusChange = async (status: "IN" | "OUT") => {
    if (!vehicle) return;
    if (changingStatus) return;

    const current = vehicle.status;
    const next = status;

    setChangingStatus(true);

    try {
      setVehicle({ ...vehicle, status: next });
      await storageService.updateVehicleStatus(vehicle.id, next);

      const auth = await authService.getAuth();
      const employeeId = auth?.userId;
      if (!employeeId) throw new Error("Missing employeeId (userId)");

      await vehicleService.updateStatus({
        vehicleId: Number(vehicle.id),
        employeeId: Number(employeeId),
        status: next,
      });
    } catch (error) {
      console.log("STATUS UPDATE ERROR:", error);

      setVehicle({ ...vehicle, status: current });
      await storageService.updateVehicleStatus(vehicle.id, current);
      Alert.alert("錯誤", "狀態更新失敗");
    } finally {
      setChangingStatus(false);
    }
  };

  const handleDelete = () => {
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (!vehicle) return;
    if (deleting) return;

    setDeleting(true);
    try {
      const auth = await authService.getAuth();
      const employeeId = auth?.userId;
      await vehicleService.deleteById(Number(vehicle.id));
      await storageService.deleteVehicle(vehicle.id);
      setDeleteVisible(false);
      router.back();
    } catch (error) {
      console.log("DELETE VEHICLE ERROR:", error);
      setDeleteVisible(false);
      Alert.alert("錯誤", "刪除失敗");
    } finally {
      setDeleting(false);
    }
  };

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <Text>載入中...</Text>
      </View>
    );
  }

  const isStatusIn = vehicle.status === "IN";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{vehicle.licensePlate}</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editText}>編輯</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>車主姓名</Text>
            <Text style={styles.value}>{vehicle.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>行車執照</Text>
            <Text style={styles.value}>{vehicle.licensePlate}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>手機號碼</Text>
            <Text style={styles.value}>{vehicle.phone}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>新增日期</Text>
            <Text style={styles.value}>{vehicle.createdAt}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>當前狀態</Text>
            <View style={[styles.statusBadge, isStatusIn ? styles.inBadge : styles.outBadge]}>
              <Text style={styles.statusText}>{vehicle.status}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          disabled={changingStatus}
          style={[
            styles.actionButton,
            isStatusIn ? styles.outButton : styles.inButton,
            changingStatus && { opacity: 0.6 },
          ]}
          onPress={() => handleStatusChange(isStatusIn ? "OUT" : "IN")}
        >
          <Ionicons
            name={isStatusIn ? "arrow-up-outline" : "arrow-down-outline"}
            size={24}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.actionButtonText}>{isStatusIn ? "離開 (OUT)" : "進入 (IN)"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>刪除車輛</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ✅ Delete Confirm Modal */}
      <Modal
        visible={deleteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.deleteCard}>
            <View style={styles.trashIconWrap}>
              <Ionicons name="trash-outline" size={48} color={RED} />
            </View>

            <Text style={styles.deleteTitle}>確定要刪除這輛車嗎？</Text>

            <View style={styles.deleteBtnsRow}>
              <Pressable
                disabled={deleting}
                style={({ pressed }) => [
                  styles.deleteBtn,
                  pressed && !deleting && { opacity: 0.9 },
                  deleting && { opacity: 0.6 },
                ]}
                onPress={() => setDeleteVisible(false)}
              >
                <Text style={styles.deleteBtnText}>取消</Text>
              </Pressable>

              <Pressable
                disabled={deleting}
                style={({ pressed }) => [
                  styles.deleteBtn,
                  pressed && !deleting && { opacity: 0.9 },
                  deleting && { opacity: 0.6 },
                ]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteBtnDangerText}>{deleting ? "..." : "刪除"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  backButton: { padding: 5 },
  title: { fontSize: 18, fontWeight: "600", color: "#333333" },
  content: { flex: 1, padding: 20 },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  label: { fontSize: 16, color: "#000000" },
  value: { fontSize: 16, color: "#333333", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#F0F0F0" },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  inBadge: { backgroundColor: "#5FCCC4" },
  outBadge: { backgroundColor: "#FF8B9A" },
  statusText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },

  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 18,
    marginBottom: 20,
  },
  inButton: { backgroundColor: "#5FCCC4" },
  outButton: { backgroundColor: "#FF8B9A" },
  buttonIcon: { marginRight: 10 },
  actionButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },

  deleteButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF8B9A",
    marginBottom: 40,
  },
  deleteText: { fontSize: 16, color: "#FF8B9A", fontWeight: "500" },

  editButton: { paddingHorizontal: 12, paddingVertical: 8 },
  editText: { fontSize: 16, color: "#5FCCC4", fontWeight: "500" },

  // ✅ Modal styles (giống thiết kế)
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  deleteCard: {
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
  trashIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },
  deleteBtnsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  deleteBtn: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  deleteBtnText: { fontSize: 18, fontWeight: "700", color: "#111" },
  deleteBtnDangerText: { fontSize: 18, fontWeight: "800", color: RED },
});
