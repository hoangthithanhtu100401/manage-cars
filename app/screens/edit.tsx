import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { storageService } from '../../services/storageService';
import { Vehicle } from '../../types/vehicle';

export default function EditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [phone, setPhone] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadVehicle();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadVehicle = async () => {
    const vehicles = await storageService.loadVehicles();
    const found = vehicles.find(v => v.id === params.vehicleId);
    if (found) {
      setVehicle(found);
      setName(found.name);
      setLicensePlate(found.licensePlate);
      setPhone(found.phone);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !licensePlate.trim() || !phone.trim()) {
      Alert.alert('錯誤', '請填寫所有欄位');
      return;
    }

    if (!vehicle) return;

    try {
      await storageService.updateVehicle(vehicle.id, {
        name: name.trim(),
        licensePlate: licensePlate.trim(),
        phone: phone.trim(),
      });
      Alert.alert('成功', '修改成功', [
        {
          text: '確定',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('錯誤', '修改失敗');
    }
  };

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <Text>載入中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>編輯車輛</Text>
        <View style={styles.placeholder} />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <InputField
            label="車主姓名"
            value={name}
            onChangeText={setName}
            placeholder="請輸入車主姓名"
          />

          <InputField
            label="車牌號"
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="請輸入車牌號"
          />

          <InputField
            label="電話"
            value={phone}
            onChangeText={setPhone}
            placeholder="請輸入電話號碼"
          />

          <InputField
            label="新增日期"
            value={vehicle.dateAdded}
            onChangeText={() => {}}
            editable={false}
          />

          <View style={styles.buttonContainer}>
            <Button title="儲存" onPress={handleSave} variant="primary" />
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 28,
    color: '#333333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});
