// TimePicker.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const TimePicker = ({ onTimeSelected }) => {
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [showHourPicker, setShowHourPicker] = useState(false);
  const [showMinutePicker, setShowMinutePicker] = useState(false);
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);

  const hours = Array.from({ length: 12 }, (_, index) =>
    String(index + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, index) =>
    String(index).padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
    setShowHourPicker(false);
  };

  const handleMinuteChange = (minute) => {
    setSelectedMinute(minute);
    setShowMinutePicker(false);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setShowPeriodPicker(false);
  };

  const updateSelectedTime = () => {
    onTimeSelected(selectedHour, selectedMinute, selectedPeriod);
  };

  useEffect(() => {
    updateSelectedTime();
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const renderPicker = (
    data,
    selectedValue,
    handleSelect,
    visible,
    closeModal
  ) => {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <ScrollView>
                {data.map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.pickerItem,
                      value === selectedValue && styles.selectedItem,
                    ]}
                    onPress={() => {
                      handleSelect(value);
                      updateSelectedTime();
                    }}
                  >
                    <Text style={styles.pickerText}>{value}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Hour Picker */}
      <TouchableOpacity onPress={() => setShowHourPicker(true)}>
        <Text style={styles.itemText}>{selectedHour}</Text>
      </TouchableOpacity>
      {renderPicker(hours, selectedHour, handleHourChange, showHourPicker, () =>
        setShowHourPicker(false)
      )}

      {/* Minute Picker */}
      <TouchableOpacity onPress={() => setShowMinutePicker(true)}>
        <Text style={styles.itemText}>{selectedMinute}</Text>
      </TouchableOpacity>
      {renderPicker(
        minutes,
        selectedMinute,
        handleMinuteChange,
        showMinutePicker,
        () => setShowMinutePicker(false)
      )}

      {/* Period Picker */}
      <TouchableOpacity onPress={() => setShowPeriodPicker(true)}>
        <Text style={styles.itemText}>{selectedPeriod}</Text>
      </TouchableOpacity>
      {renderPicker(
        periods,
        selectedPeriod,
        handlePeriodChange,
        showPeriodPicker,
        () => setShowPeriodPicker(false)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#25d366",
    marginRight: 10,
  },
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

export default TimePicker;
