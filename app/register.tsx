import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal } from "react-native";


const TEAL = "#5CC6BA";
const BORDER = "#BFBFBF";
const TEXT = "#111";
const ERROR = "#FE6262";

type FieldKey = "name" | "email" | "phone" | "password" | "confirm";

function PillInput({
  iconLeft,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  rightIcon,
  onPressRight,
  onBlur,
  isError,
}: {
  iconLeft: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onPressRight?: () => void;
  onBlur?: () => void;
  isError?: boolean;
}) {
  return (
    <View style={[styles.inputBox, isError && styles.inputBoxError]}>
      <Ionicons name={iconLeft} size={24} color={TEAL} style={styles.leftIcon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#666"
        style={styles.input}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        onBlur={onBlur}
      />

      {rightIcon ? (
        <Pressable onPress={onPressRight} hitSlop={10} style={styles.rightIconBtn}>
          <Ionicons name={rightIcon} size={24} color={TEAL} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** ===== Validators (đúng theo ảnh) ===== */
function isTaiwanPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  // TW mobile thường: 09xxxxxxxx (10 digits)
  return /^09\d{8}$/.test(digits);
}

function isEmail(email: string) {
  // regex vừa đủ dùng cho UI
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isPasswordValid(pw: string) {
  // 8~20, có ít nhất 1 chữ và 1 số
  const lenOk = pw.length >= 8 && pw.length <= 20;
  const hasLetter = /[A-Za-z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  return lenOk && hasLetter && hasNumber;
}

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [hidePw, setHidePw] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [successVisible, setSuccessVisible] = useState(false);


  // touched: chỉ hiện lỗi sau khi user chạm vào field (hoặc submit)
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirm: false,
  });

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};

    // required
    if (!name.trim()) e.name = "此欄位必填";

    if (!email.trim()) e.email = "此欄位必填";
    else if (!isEmail(email)) e.email = "請輸入正確 E-mail 格式";

    if (!phone.trim()) e.phone = "此欄位必填";
    else if (!isTaiwanPhone(phone)) e.phone = "請輸入正確手機號碼格式";

    if (!password) e.password = "此欄位必填";
    else if (!isPasswordValid(password))
      e.password = "密碼限 8~20 個字元，必須包含至少一個英文字母及數字";

    if (!confirm) e.confirm = "此欄位必填";
    else if (confirm !== password) e.confirm = "您再次輸入的密碼不正確";

    return e;
  }, [name, email, phone, password, confirm]);

  const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const showError = (key: FieldKey) => touched[key] && !!errors[key];

  const markTouched = (key: FieldKey) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const onSubmit = () => {
    // khi bấm submit, show toàn bộ lỗi
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirm: true,
    });

    if (!canSubmit) return;

  // TODO: gọi API register
  console.log("REGISTER:", { name, email, phone, password });

  setSuccessVisible(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <Text style={styles.title}>註冊</Text>

          <View style={styles.form}>
            {/* 姓名 */}
            <View style={styles.block}>
              <PillInput
                iconLeft="person-outline"
                placeholder="帳號"
                value={name}
                onChangeText={setName}
                onBlur={() => markTouched("name")}
                isError={showError("name")}
              />
              {showError("name") ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* E-mail */}
            <View style={styles.block}>
              <PillInput
                iconLeft="mail-outline"
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                onBlur={() => markTouched("email")}
                isError={showError("email")}
              />
              {showError("email") ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* 手機號碼 */}
            <View style={styles.block}>
              <PillInput
                iconLeft="call-outline"
                placeholder="手機號碼"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                onBlur={() => markTouched("phone")}
                isError={showError("phone")}
              />
              {showError("phone") ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            {/* 密碼 */}
            <View style={styles.block}>
              <PillInput
                iconLeft="lock-closed-outline"
                placeholder="密碼"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidePw}
                rightIcon={hidePw ? "eye-off-outline" : "eye-outline"}
                onPressRight={() => setHidePw((v) => !v)}
                onBlur={() => markTouched("password")}
                isError={showError("password")}
              />
              {showError("password") ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* 密碼確認 */}
            <View style={styles.block}>
              <PillInput
                iconLeft="lock-closed-outline"
                placeholder="密碼確認"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={hideConfirm}
                rightIcon={hideConfirm ? "eye-off-outline" : "eye-outline"}
                onPressRight={() => setHideConfirm((v) => !v)}
                onBlur={() => markTouched("confirm")}
                isError={showError("confirm")}
              />
              {showError("confirm") ? (
                <Text style={styles.errorText}>{errors.confirm}</Text>
              ) : null}
            </View>

            {/* Button */}
            <Pressable
              onPress={onSubmit}
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && { opacity: 0.92 },
              ]}
            >
              <Text style={styles.submitText}>確定</Text>
            </Pressable>

            {/* bottom link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>已有帳號？</Text>
              <Pressable onPress={() => router.replace("/login")} hitSlop={8}>
                <Text style={styles.bottomLink}>登入</Text>
              </Pressable>
            </View>
          </View>
          <Modal
                visible={successVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSuccessVisible(false)}
                >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                    <View style={styles.modalIconWrap}>
                        <Ionicons name="checkmark" size={36} color={TEAL} />
                    </View>

                    <Text style={styles.modalTitle}>註冊成功!</Text>

                    <Pressable
                        onPress={() => {
                        setSuccessVisible(false);
                        router.replace("/login"); // bấm 確定 -> về login
                        }}
                        style={({ pressed }) => [styles.modalBtn, pressed && { opacity: 0.9 }]}
                    >
                        <Text style={styles.modalBtnText}>確定</Text>
                    </Pressable>
                    </View>
                </View>
                </Modal>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },

  // canh giữa trong ScrollView
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: TEXT,
    marginBottom: 26,
    letterSpacing: 2,
  },

  form: {
    width: "100%",
    maxWidth: 520,
  },

  block: {
    marginBottom: 20,
  },

  inputBox: {
    width: "100%",
    height: 54,
    borderRadius: 15,
    borderWidth: 1.6,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "white",
  },
  inputBoxError: {
    borderColor: ERROR,
  },

  leftIcon: { marginRight: 12 },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  rightIconBtn: {
    paddingLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    marginTop: 8,
    color: ERROR,
    fontSize: 16,
    fontWeight: "700",
  },

  submitBtn: {
    width: "100%",
    height: 60,
    borderRadius: 20,
    backgroundColor: TEAL,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  submitText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 2,
  },

  bottomRow: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },

  bottomText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },

  bottomLink: {
    fontSize: 14,
    color: TEAL,
    fontWeight: "800",
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
  maxWidth: 520,
  backgroundColor: "white",
  borderRadius: 22,
  paddingVertical: 26,
  paddingHorizontal: 22,
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 10,
},
modalIconWrap: {
  width: 72,
  height: 72,
  borderRadius: 36,
  borderWidth: 6,
  borderColor: TEAL,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
},
modalTitle: {
  fontSize: 20,
  fontWeight: "500",
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
},
modalBtnText: {
  fontSize: 20,
  fontWeight: "500",
  color: "#111",
},

});
