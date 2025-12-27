import { Button } from '@/components/common/Button';
import { InputField } from '@/components/common/InputField';
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
  View,
} from 'react-native';

export default function AddTab() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [phone, setPhone] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !licensePlate.trim() || !phone.trim()) {
      Alert.alert('錯誤', '請填寫所有欄位');
      return;
    }

    try {
      await storageService.addVehicle({
        name: name.trim(),
        licensePlate: licensePlate.trim(),
        phone: phone.trim(),
        dateAdded: getCurrentDate(),
        status: 'OUT',
      });

      Alert.alert('成功', '儲存成功', [
        {
          text: '確定',
          onPress: () => {
            setName('');
            setLicensePlate('');
            setPhone('');
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
      <View style={styles.header}>
        <Text style={styles.title}>新增車輛</Text>
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
            value={getCurrentDate()}
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
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});
