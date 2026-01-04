import { storageService } from '@/services/storageService';
import { getCurrentDate } from '@/utils/dateUtils';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddTab() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'IN' | 'OUT'>('IN');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Error states
  const [nameError, setNameError] = useState('');
  const [licensePlateError, setLicensePlateError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Validation functions
  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError('車主姓名不能為空');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateLicensePlate = (value: string) => {
    if (!value.trim()) {
      setLicensePlateError('行車執照不能為空');
      return false;
    }
    // Validate format: AAAA-1234
    const licensePlateRegex = /^[A-Z]{4}-\d{4}$/;
    if (!licensePlateRegex.test(value.trim())) {
      setLicensePlateError('行車執照格式錯誤 (例: AAAA-1234)');
      return false;
    }
    setLicensePlateError('');
    return true;
  };

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      setPhoneError('手機號碼不能為空');
      return false;
    }
    // Validate: must start with 09 and have exactly 10 digits
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(value.trim())) {
      setPhoneError('手機號碼必須以09開頭且為10位數字');
      return false;
    }
    setPhoneError('');
    return true;
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      licensePlate.trim() !== '' &&
      phone.trim() !== '' &&
      !nameError &&
      !licensePlateError &&
      !phoneError &&
      /^[A-Z]{4}-\d{4}$/.test(licensePlate.trim()) &&
      /^09\d{8}$/.test(phone.trim())
    );
  };

  const handleSave = async () => {
    // Validate all fields
    const isNameValid = validateName(name);
    const isLicensePlateValid = validateLicensePlate(licensePlate);
    const isPhoneValid = validatePhone(phone);

    if (!isNameValid || !isLicensePlateValid || !isPhoneValid) {
      return;
    }

    try {
      await storageService.addVehicle({
        name: name.trim(),
        licensePlate: licensePlate.trim(),
        phone: phone.trim(),
        dateAdded: getCurrentDate(),
        status: status,
      });

      Alert.alert('成功', '儲存成功', [
        {
          text: '確定',
          onPress: () => {
            setName('');
            setLicensePlate('');
            setPhone('');
            setStatus('IN');
            setNameError('');
            setLicensePlateError('');
            setPhoneError('');
            router.push('/(tabs)/search');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('錯誤', '儲存失敗');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>新增</Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
          {/* 車主姓名 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>車主姓名</Text>
            <TextInput
              style={[styles.textInput, nameError && styles.textInputError]}
              value={name}
              onChangeText={(value) => {
                setName(value);
                validateName(value);
              }}
              onBlur={() => validateName(name)}
              placeholder="請輸入"
              placeholderTextColor="#C7C7CC"
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          {/* 行車執照 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>行車執照</Text>
            <TextInput
              style={[styles.textInput, licensePlateError && styles.textInputError]}
              value={licensePlate}
              onChangeText={(value) => {
                setLicensePlate(value.toUpperCase());
                validateLicensePlate(value.toUpperCase());
              }}
              onBlur={() => validateLicensePlate(licensePlate)}
              placeholder="AAAA-1234"
              placeholderTextColor="#C7C7CC"
              autoCapitalize="characters"
              maxLength={9}
            />
            {licensePlateError ? <Text style={styles.errorText}>{licensePlateError}</Text> : null}
          </View>

          {/* 手機號碼 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>手機號碼</Text>
            <TextInput
              style={[styles.textInput, phoneError && styles.textInputError]}
              value={phone}
              onChangeText={(value) => {
                setPhone(value);
                validatePhone(value);
              }}
              onBlur={() => validatePhone(phone)}
              placeholder="09xxxxxxxx"
              placeholderTextColor="#C7C7CC"
              keyboardType="phone-pad"
              maxLength={10}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          {/* 新增日期 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>新增日期</Text>
            <View style={[styles.textInput, styles.disabledInput]}>
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
            </View>
          </View>

          {/* 狀態 Toggle */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>狀態</Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'IN' && styles.statusButtonActiveIn,
                ]}
                onPress={() => setStatus('IN')}
              >
                <Text style={[
                  styles.statusIcon,
                  status === 'IN' && styles.statusIconActive
                ]}>↓</Text>
                <Text
                  style={[
                    styles.statusText,
                    status === 'IN' && styles.statusTextActive,
                  ]}
                >
                  IN
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'OUT' && styles.statusButtonActiveOut,
                ]}
                onPress={() => setStatus('OUT')}
              >
                <Text style={[
                  styles.statusIcon,
                  status === 'OUT' && styles.statusIconActive
                ]}>↑</Text>
                <Text
                  style={[
                    styles.statusText,
                    status === 'OUT' && styles.statusTextActive,
                  ]}
                >
                  OUT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* 確定 Button */}
        <TouchableOpacity 
          style={[styles.saveButton, !isFormValid() && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={!isFormValid()}
        >
          <Text style={styles.saveButtonText}>確定</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    fontSize: 15,
    color: '#333333',
  },
  textInputError: {
    borderColor: '#FF3B30',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 6,
    marginLeft: 4,
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#333333',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 70,
    justifyContent: 'center',
  },
  statusButton: {
    width: 74,
    height: 72,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  statusButtonActiveIn: {
    backgroundColor: '#5EBFB3',
    borderColor: '#5EBFB3',
  },
  statusButtonActiveOut: {
    backgroundColor: '#FF8B9A',
    borderColor: '#FF8B9A',
  },
  statusIcon: {
    fontSize: 18,
    marginBottom: 4,
    color: '#C7C7CC',
  },
  statusIconActive: {
    color: '#FFFFFF',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C7C7CC',
  },
  statusTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#5EBFB3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#5EBFB3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#C7C7CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});