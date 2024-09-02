import React from "react";
import { Platform, View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface PickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
}

const IOSPicker = ({ selectedValue, onValueChange, items }: PickerProps) => {
  return (
    <View style={styles.iosPicker}>
      <Picker selectedValue={selectedValue} onValueChange={onValueChange} itemStyle={styles.iosPickerItem}>
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const AndroidPicker = ({ selectedValue, onValueChange, items }: PickerProps) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onValueChange(item.value);
        setModalVisible(false);
      }}
    >
      <Text style={[styles.itemText, item.value === selectedValue && styles.selectedItemText]}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity style={styles.androidPickerTrigger} onPress={() => setModalVisible(true)}>
        <Text style={styles.androidPickerTriggerText}>
          {selectedValue ? items.find((item) => item.value === selectedValue)?.label : "Select a state"}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.value} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const PlatformPicker = Platform.select({
  ios: IOSPicker,
  android: AndroidPicker,
  default: AndroidPicker,
});

const styles = StyleSheet.create({
  iosPicker: {
    marginTop: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  iosPickerItem: {
    fontSize: 16,
  },
  androidPickerTrigger: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  androidPickerTriggerText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  itemText: {
    fontSize: 16,
  },
  selectedItemText: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default PlatformPicker;
