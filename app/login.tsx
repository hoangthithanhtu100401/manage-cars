import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState, useEffect  } from "react";
import {
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
import { Modal } from "react-native";
import { loginApi } from "@/services/auth";
import { setToken, setRefreshToken} from "@/services/token";
import {
  getRememberEnabled,
  loadRememberAccount,
  saveRememberAccount,
  clearRememberAccount,
  setRememberEnabled,
} from "@/services/remember";
import { setUserId } from "@/services/session";
import { authService } from "@/services/authService";


const TEAL = "#59C6BC";
const BORDER = "#CFCFCF";
const CARD_BG = "#F6F6F6";
const TEXT = "#111";

function FieldLabel({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.labelRow}>
      <Ionicons name={icon} size={22} color={TEAL} />
      <Text style={styles.labelText}>{text}</Text>
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
    const [loading, setLoading] = useState(false);
const [remember, setRemember] = useState(false);

  const [ownerName, setOwnerName] = useState("");
  const [license, setLicense] = useState("");

  // Bắt chước đúng UI: cả 2 field đều có icon mắt (toggle ẩn/hiện)
  const [hideOwner, setHideOwner] = useState(false);
  const [hideLicense, setHideLicense] = useState(true);
    const [errorVisible, setErrorVisible] = useState(false);
    const [touchedPw, setTouchedPw] = useState(false);
    const [touchedAccount, setTouchedAccount] = useState(false);
    useEffect(() => {
  (async () => {
    const enabled = await getRememberEnabled();
    setRemember(enabled);

    if (enabled) {
      const { username, password } = await loadRememberAccount();
      if (username) setOwnerName(username);
      if (password) setLicense(password);
    }
  })();
}, []);

const accountError = useMemo(() => {
  if (!touchedAccount) return "";
  if (ownerName.trim().length === 0) return "此欄位必填";
  return "";
}, [ownerName, touchedAccount]);

    const pwError = useMemo(() => {
    const pw = license.trim();
    if (!touchedPw) return "";              
    if (pw.length === 0) return "此欄位必填";
    const lenOk = pw.length >= 8 && pw.length <= 20;
    const hasLetter = /[A-Za-z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    if (!lenOk || !hasLetter || !hasNumber) {
        return "密碼限 8~20 個字元，必須包含至少一個英文字母及數字";
    }
    return "";
    }, [license, touchedPw]);


  const canSubmit = useMemo(() => {
    const okAccount = ownerName.trim().length > 0;
    const pw = license.trim();
    const lenOk = pw.length >= 8 && pw.length <= 20;
    const hasLetter = /[A-Za-z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const okPw = pw.length > 0 && lenOk && hasLetter && hasNumber;

    return okAccount && okPw;
    }, [ownerName, license]);


  const onSubmit = async () => {
    setTouchedAccount(true);
    setTouchedPw(true);

    if (!canSubmit) return;

    try {
            setLoading(true);

            const res = await loginApi(ownerName.trim(), license.trim());
            const raw = res.raw;

    await authService.saveAuth({
      userId: raw.userId,
      token: raw.token,
      refreshToken: raw.refreshToken,
      displayName: raw.displayName,
      expiration: raw.expiration,
    });
            if (remember) {
                await setRememberEnabled(true);
                await saveRememberAccount(ownerName.trim(), license);
            } else {
                await clearRememberAccount();
            }

            router.replace("/(tabs)/search");
        } catch (e: any) {
            if (e?.status === 401) {
            setErrorVisible(true);
            } else {
            console.log("LOGIN ERROR:", e);
            setErrorVisible(true); 
            }
        }   finally {
        setLoading(false);
        }
    };



  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={styles.title}>登入</Text>

          {/* Card */}
          <View style={styles.card}>
            {/* Field 1 */}
            <FieldLabel icon="person-outline" text="帳號" />
            <View style={styles.inputWrap}>
              <TextInput
                value={ownerName}
                onChangeText={setOwnerName}
                style={styles.input}
                placeholder="請輸入帳號"
                placeholderTextColor="#9A9A9A"
                secureTextEntry={hideOwner}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onBlur={() => setTouchedAccount(true)}
                />

              <Pressable
                onPress={() => setHideOwner((v) => !v)}
                hitSlop={10}
                style={styles.eyeBtn}
              >
              </Pressable>
            </View>
            {accountError ? <Text style={styles.errorText}>{accountError}</Text> : null}

            {/* spacing */}
            <View style={{ height: 50 }} />

            {/* Field 2 */}
            <FieldLabel icon="lock-closed-outline" text="密碼" />
            <View style={styles.inputWrap}>
              <TextInput
                value={license}
                onChangeText={setLicense}
                style={styles.input}
                placeholder="請輸入密碼"
                placeholderTextColor="#9A9A9A"
                secureTextEntry={hideLicense}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onBlur={() => setTouchedPw(true)}
                onSubmitEditing={onSubmit}
                />

              <Pressable
                onPress={() => setHideLicense((v) => !v)}
                hitSlop={10}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={hideLicense ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={TEAL}
                />
              </Pressable>
            </View>
            {pwError ? <Text style={styles.errorText}>{pwError}</Text> : null}
<View style={styles.rememberRow}>
  <Pressable
    onPress={() => setRemember((v) => !v)}
    hitSlop={10}
    style={({ pressed }) => [styles.checkbox, pressed && { opacity: 0.85 }]}
  >
    {remember ? (
      <Ionicons name="checkmark" size={18} color={TEAL} />
    ) : null}
  </Pressable>

  <Pressable onPress={() => setRemember((v) => !v)} hitSlop={10}>
    <Text style={styles.rememberText}>記住帳號</Text>
  </Pressable>
</View>


            {/* Button */}
            <Pressable
                onPress={onSubmit}
                disabled={!canSubmit || loading}
                style={({ pressed }) => [
                    styles.submitBtn,
                    (!canSubmit || loading) && styles.submitBtnDisabled,
                    pressed && canSubmit && !loading && { opacity: 0.9 },
                ]}
                >
                <Text style={styles.submitText}>{loading ? "..." : "確定"}</Text>
            </Pressable>

          </View>

          {/* Bottom text */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>還沒有帳號？</Text>
            <Pressable
              onPress={() => {
                router.push("/register");
              }}
              hitSlop={8}
            >
              <Text style={styles.bottomLink}>註冊</Text>
            </Pressable>
          </View>
          <Modal
  visible={errorVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setErrorVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCardError}>
      <View style={styles.modalErrorIconWrap}>
        {/* icon i */}
        <Text style={styles.modalErrorIconText}>i</Text>
      </View>

      <Text style={styles.modalTitle}>帳號或密碼不正確</Text>

      <Pressable
        onPress={() => setErrorVisible(false)}
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
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: TEXT,
    marginBottom: 22,
    letterSpacing: 2,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: CARD_BG,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 35,
    paddingBottom: 35,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  labelText: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT,
  },
  inputWrap: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    overflow: "hidden",
  },
  input: {
    height: 54,
    paddingLeft: 18,
    paddingRight: 52, // chừa chỗ cho icon mắt
    fontSize: 16,
    color: "#333",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtn: {
    marginTop: 50,
    height: 60,
    borderRadius: 30,
    backgroundColor: TEAL,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.55,
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
    alignItems: "center",
    gap: 14,
  },
  bottomText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  bottomLink: {
    fontSize: 16,
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
modalCardError: {
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
modalErrorIconWrap: {
  width: 56,
  height: 56,
  borderRadius: 28,
  borderWidth: 3,
  borderColor: "#FF4D4F",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
},
modalErrorIconText: {
  color: "#FF4D4F",
  fontSize: 28,
  fontWeight: "900",
  marginTop: -2, // để nhìn giống ảnh hơn
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
errorText: {
  marginTop: 8,
  color: "#FF4D4F",
  fontSize: 14,
  fontWeight: "700",
},
rememberRow: {
  marginTop: 16,
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
},
checkbox: {
  width: 22,
  height: 22,
  borderRadius: 4,
  borderWidth: 1.5,
  borderColor: "#CFCFCF",
  backgroundColor: "white",
  justifyContent: "center",
  alignItems: "center",
},
rememberText: {
  fontSize: 16,
  color: "#111",
  fontWeight: "500",
},


});
