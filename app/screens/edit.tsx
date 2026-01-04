import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { storageService } from "../../services/storageService";
import { Vehicle } from "../../types/vehicle";
import { vehicleService } from "@/services/vehicleService"; 
import { Modal } from "react-native";

const TEAL = "#59C6BC";
const BORDER = "#CFCFCF";
const BG = "#FFFFFF";
const TEXT = "#111";

export default function EditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [name, setName] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [phone, setPhone] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      await loadVehicle();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    })();
  }, []);

  const loadVehicle = async () => {
    const vehicles = await storageService.loadVehicles();
    const found = vehicles.find((v) => v.id === params.vehicleId);
    if (found) {
      setVehicle(found);
      setName(found.name ?? "");
      setLicensePlate(found.licensePlate ?? "");
      setPhone(found.phone ?? "");
    }
  };

 const handleSave = async () => {
    if (!name.trim() || !licensePlate.trim() || !phone.trim()) {
      setSuccessVisible(true);
      return;
    }
    if (!vehicle) return;

    try {
      await vehicleService.updateVehicle(Number(vehicle.id), {
        owner: name.trim(),
        plateNumber: licensePlate.trim(),
        licenseNumber: licensePlate.trim(),
        phone: phone.trim(),
        vehicleStatus: vehicle.status as "IN" | "OUT",
      });

      await storageService.updateVehicle(vehicle.id, {
        name: name.trim(),
        licensePlate: licensePlate.trim(),
        phone: phone.trim(),
      });

      setSuccessVisible(true); // ✅ show modal Figma
    } catch (error: any) {
      console.log("UPDATE VEHICLE ERROR:", error);
      Alert.alert("錯誤", error?.message ?? "修改失敗");
    }

  };

  if (!vehicle) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: "center", alignItems: "center" }]}>
        <Text>載入中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#111" />
        </Pressable>

        <Text style={styles.headerTitle}>編輯車輛</Text>

        {/* placeholder để title luôn ở giữa */}
        <View style={styles.headerRightPlaceholder} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Card */}
            <View style={styles.card}>
              <Field
                label="車主姓名"
                value={name}
                onChangeText={setName}
                placeholder="請輸入車主姓名"
              />

              <Field
                label="行車執照"
                value={licensePlate}
                onChangeText={setLicensePlate}
                placeholder="AAA - 1234"
              />

              <Field
                label="手機號碼"
                value={phone}
                onChangeText={setPhone}
                placeholder="0900000000"
                keyboardType="phone-pad"
              />

              <Field
                label="新增日期"
                value={vehicle.createdAt ?? ""}
                onChangeText={() => {}}
                editable={false}
              />
            </View>

            {/* Button */}
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text style={styles.primaryBtnText}>確定</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
      <Modal
  visible={successVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setSuccessVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <View style={styles.modalIconWrap}>
        <Ionicons name="checkmark" size={34} color={TEAL} />
      </View>

      <Text style={styles.modalTitle}>車輛資訊已成功更新!</Text>

      <Pressable
        onPress={() => {
          setSuccessVisible(false);
          router.back(); // ✅ bấm 確定 thì quay về detail
        }}
        style={({ pressed }) => [styles.modalBtn, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.modalBtnText}>確定</Text>
      </Pressable>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
}

/** --- Field component (label + input) --- */
function Field(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: "default" | "phone-pad" | "email-address" | "numeric";
}) {
  const { label, editable = true } = props;

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={[styles.inputWrap, !editable && styles.inputWrapDisabled]}>
        <TextInput
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor="#9A9A9A"
          editable={editable}
          keyboardType={props.keyboardType}
          style={[styles.input, !editable && styles.inputDisabled]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800", // medium
    color: TEXT,
  },
  headerRightPlaceholder: { width: 44, height: 44 },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "#E6E6E6",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 10,
  },

  inputWrap: {
    height: 54, // ✅ yêu cầu
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  inputWrapDisabled: {
    backgroundColor: "#F7F7F7",
  },
  input: {
    fontSize: 16, // ✅ yêu cầu
    color: "#111",
  },
  inputDisabled: {
    color: "#111",
    opacity: 0.9,
  },

  primaryBtn: {
    marginTop: 18,
    height: 64,
    borderRadius: 30,
    backgroundColor: TEAL,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 2,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.35)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 18,
},
modalCard: {
  width: "100%",
  maxWidth: 560,
  backgroundColor: "#FFFFFF",
  borderRadius: 26,
  paddingTop: 26,
  paddingBottom: 22,
  paddingHorizontal: 22,
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 10 },
  elevation: 12,
},
modalIconWrap: {
  width: 64,
  height: 64,
  borderRadius: 32,
  borderWidth: 4,
  borderColor: TEAL,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
},
modalTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#111",
  marginBottom: 18,
},
modalBtn: {
  width: "100%",
  height: 56,
  borderRadius: 18,
  borderWidth: 1.5,
  borderColor: "#D9D9D9",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
},
modalBtnText: {
  fontSize: 20,
  fontWeight: "600",
  color: "#111",
},

});
