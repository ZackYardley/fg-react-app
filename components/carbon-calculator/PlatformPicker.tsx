import { useState } from "react";
import { Platform, View, Text, Modal, FlatList, StyleSheet, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "../common";
import { useThemeColor } from "@/hooks";

interface PickerProps {
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  disabled?: boolean;
}

const IOSPicker = ({ selectedValue, onValueChange, items, disabled }: PickerProps) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const selectedItem = items.find((item) => item.value === selectedValue);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");

  return (
    <View>
      <Pressable
        style={[styles.iosPickerTrigger, { backgroundColor, borderColor: borderColor }]}
        onPress={() => !disabled && setIsPickerVisible(true)}
      >
        <ThemedText style={[styles.iosPickerTriggerText, disabled && styles.disabledText]}>
          {selectedItem ? selectedItem.label : "Select a state"}
        </ThemedText>
      </Pressable>
      <Modal visible={isPickerVisible} animationType="slide" transparent={true}>
        <View style={styles.iosModalContainer}>
          <View style={[styles.iosModalContent, { backgroundColor }]}>
            <Pressable style={styles.iosDoneButton} onPress={() => setIsPickerVisible(false)}>
              <Text style={styles.iosDoneButtonText}>Done</Text>
            </Pressable>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => {
                onValueChange(itemValue);
              }}
              itemStyle={[styles.iosPickerItem, { color: textColor }]}
              enabled={!disabled}
              style={{ backgroundColor }}
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

const AndroidPicker = ({ selectedValue, onValueChange, items, disabled }: PickerProps) => {
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

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <View>
      <Pressable
        style={[styles.androidPickerTrigger, { backgroundColor, borderColor: textColor }]}
        onPress={() => !disabled && setModalVisible(true)}
      >
        <ThemedText style={[styles.androidPickerTriggerText, disabled && styles.disabledText]}>
          {selectedValue ? items.find((item) => item.value === selectedValue)?.label : "Select a state"}
        </ThemedText>
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
    borderWidth: 1,
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
    borderWidth: 1,
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
  disabledText: {
    color: "#9CA3AF",
  },
});

export default PlatformPicker;
