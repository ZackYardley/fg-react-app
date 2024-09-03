import { useState } from "react";
import { Platform, View, Text, Modal, FlatList, StyleSheet, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface PickerProps {
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
}

const IOSPicker = ({ selectedValue, onValueChange, items }: PickerProps) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const selectedItem = items.find((item) => item.value === selectedValue);

  return (
    <View>
      <Pressable style={styles.iosPickerTrigger} onPress={() => setIsPickerVisible(true)}>
        <Text style={styles.iosPickerTriggerText}>{selectedItem ? selectedItem.label : "Select a state"}</Text>
      </Pressable>
      <Modal visible={isPickerVisible} animationType="slide" transparent={true}>
        <View style={styles.iosModalContainer}>
          <View style={styles.iosModalContent}>
            <Pressable style={styles.iosDoneButton} onPress={() => setIsPickerVisible(false)}>
              <Text style={styles.iosDoneButtonText}>Done</Text>
            </Pressable>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => {
                onValueChange(itemValue);
              }}
              itemStyle={styles.iosPickerItem}
            >
              {items.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AndroidPicker = ({ selectedValue, onValueChange, items }: PickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <Pressable
      style={styles.item}
      onPress={() => {
        onValueChange(item.value);
        setModalVisible(false);
      }}
    >
      <Text style={[styles.itemText, item.value === selectedValue && styles.selectedItemText]}>{item.label}</Text>
    </Pressable>
  );

  return (
    <View>
      <Pressable style={styles.androidPickerTrigger} onPress={() => setModalVisible(true)}>
        <Text style={styles.androidPickerTriggerText}>
          {selectedValue ? items.find((item) => item.value === selectedValue)?.label : "Select a state"}
        </Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.value} />
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
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
  iosPickerTrigger: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  iosPickerTriggerText: {
    fontSize: 16,
  },
  iosModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  iosModalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  iosDoneButton: {
    alignSelf: "flex-end",
    padding: 10,
    marginRight: 10,
  },
  iosDoneButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "bold",
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
