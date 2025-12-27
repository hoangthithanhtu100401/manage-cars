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
import { storageService } from '../../services/storageService';
import { Vehicle } from '../../types/vehicle';

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
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
    }
  };

  const handleStatusChange = async (status: 'IN' | 'OUT') => {
    if (!vehicle) return;

    try {
      await storageService.updateVehicleStatus(vehicle.id, status);
      setVehicle({ ...vehicle, status });
      Alert.alert('成功', `狀態已更新為 ${status}`);
    } catch (error) {
      Alert.alert('錯誤', '狀態更新失敗');
    }
  };

  const handleEdit = () => {
    if (vehicle) {
      router.push({
        pathname: '/screens/edit',
        params: { vehicleId: vehicle.id },
      });
    }
  };

  const handleDelete = () => {
    Alert.alert('確認刪除', '確定要刪除這輛車嗎？', [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: async () => {
          if (vehicle) {
            try {
              await storageService.deleteVehicle(vehicle.id);
              Alert.alert('成功', '刪除成功', [
                { text: '確定', onPress: () => router.back() },
              ]);
            } catch (error) {
              Alert.alert('錯誤', '刪除失敗');
            }
          }
        },
      },
    ]);
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
        <Text style={styles.title}>車輛詳情</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editText}>編輯</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>車主姓名</Text>
              <Text style={styles.value}>{vehicle.name}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>車牌號</Text>
              <Text style={styles.value}>{vehicle.licensePlate}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>電話</Text>
              <Text style={styles.value}>{vehicle.phone}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>新增日期</Text>
              <Text style={styles.value}>{vehicle.dateAdded}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>當前狀態</Text>
              <View style={[styles.statusBadge, vehicle.status === 'IN' ? styles.inBadge : styles.outBadge]}>
                <Text style={styles.statusText}>{vehicle.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              title="進入 (IN)"
              onPress={() => handleStatusChange('IN')}
              variant="in"
            />
            <Button
              title="離開 (OUT)"
              onPress={() => handleStatusChange('OUT')}
              variant="out"
            />
          </View>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>刪除車輛</Text>
          </TouchableOpacity>
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
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editText: {
    fontSize: 16,
    color: '#5FCCC4',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#666666',
  },
  value: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  inBadge: {
    backgroundColor: '#5FCCC4',
  },
  outBadge: {
    backgroundColor: '#FF8B9A',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF8B9A',
    marginBottom: 40,
  },
  deleteText: {
    fontSize: 16,
    color: '#FF8B9A',
    fontWeight: '500',
  },
});
