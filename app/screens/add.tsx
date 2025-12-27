import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { InputField } from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import { storageService } from '../../services/storageService';
import { getCurrentDate } from '../../utils/dateUtils';

export default function AddVehicleScreen() {
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
      Alert.alert('错误', '请填写所有字段');
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

      Alert.alert('成功', '保存成功', [
        {
          text: '确定',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '保存失败');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>添加车辆</Text>
        <View style={styles.placeholder} />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <InputField
            label="车主姓名"
            value={name}
            onChangeText={setName}
            placeholder="请输入车主姓名"
          />

          <InputField
            label="车牌号"
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="请输入车牌号"
          />

          <InputField
            label="电话"
            value={phone}
            onChangeText={setPhone}
            placeholder="请输入电话号码"
          />

          <InputField
            label="添加日期"
            value={getCurrentDate()}
            onChangeText={() => {}}
            editable={false}
          />

          <View style={styles.buttonContainer}>
            <Button title="保存" onPress={handleSave} variant="primary" />
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
