import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

const StorePicker = ({ data, selectedValue, onSelect, onClose, navigation }) => {
  return (
    <Modal transparent animationType="fade" visible={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <ScrollView>
              {data.length ? data.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.pickerItem,
                    item.value === selectedValue && styles.selectedItem,
                  ]}
                  onPress={() => {
                    onSelect(item.value, item.label);
                    onClose();
                  }}
                >
                  <Text style={styles.pickerText}>{item.label}</Text>
                </TouchableOpacity>
              )):
              <TouchableOpacity onPress={()=>{navigation.replace('OwnerStoreScreen')}}>
              <Text style={{marginLeft:55, fontSize:25, fontWeight:700, color:'#25d366'}}>Create Your First Store</Text>
              </TouchableOpacity>
              }
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  pickerItem: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  selectedItem: {
    backgroundColor: "#25d366",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
});

export default StorePicker;
