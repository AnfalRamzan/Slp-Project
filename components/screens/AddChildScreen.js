import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useChild } from "../context/ChildContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function AddChildScreen({ navigation }) {
  const { addChild, setSelectedChild } = useChild();

  const [childName, setChildName] = useState("");
  const [mrNumber, setMrNumber] = useState("01-"); // always starts with 01-
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [parentName, setParentName] = useState("");

  // Calendar date change handler
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-GB");
      setDob(formattedDate);
    }
  };

  // Save Button Handler
  const handleSave = () => {
    // Case 1: nothing filled at all
    if (
      !childName.trim() &&
      (!mrNumber.trim() || mrNumber === "01-") &&
      !dob.trim() &&
      !gender.trim() &&
      !parentName.trim()
    ) {
      Alert.alert("Invalid Credentials", "Please enter child details first.");
      return;
    }

    // Case 2: any single missing field
    if (
      !childName.trim() ||
      !mrNumber.trim() ||
      mrNumber === "01-" ||
      !dob.trim() ||
      !gender.trim() ||
      !parentName.trim()
    ) {
      Alert.alert(
        "Incomplete Information",
        "Please fill all required fields before saving."
      );
      return;
    }

    // Save data
    const childData = {
      childName: childName.trim(),
      mrNumber: mrNumber.trim(),
      dob: dob.trim(),
      gender: gender.trim(),
      parentName: parentName.trim(),
    };

    const newChild = addChild(childData);
    setSelectedChild(newChild);

    Alert.alert("Success", "Child added successfully!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("CategoryList"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: responsiveHeight(6) }}>
          <Text style={styles.title}>Add Child</Text>

          {/* Child Name */}
          <Text style={styles.label}>Child Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Child Name"
            placeholderTextColor="#777"
            value={childName}
            onChangeText={setChildName}
          />

          {/* MR Number */}
          <Text style={styles.label}>MR Number</Text>
          <TextInput
            style={styles.input}
            placeholder="01-XXXX"
            placeholderTextColor="#777"
            value={mrNumber}
            onChangeText={(text) => {
              if (!text.startsWith("01-")) {
                setMrNumber("01-");
              } else {
                setMrNumber(text);
              }
            }}
            keyboardType="numeric"
          />

          {/* Date of Birth */}
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={{
                color: dob ? "#000" : "#777",
                fontSize: responsiveFontSize(1.9),
                paddingVertical: responsiveHeight(1),
              }}
            >
              {dob ? dob : "Select Date of Birth"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          {/* Gender Dropdown */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              {/* <Picker.Item label="Select Gender" value="" /> */}
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {/* Parent / Guardian Text Input (replaced dropdown) */}
          <Text style={styles.label}>Parent / Guardian Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Parent / Guardian Name"
            placeholderTextColor="#777"
            value={parentName}
            onChangeText={setParentName}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SAVE CHILD</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../../assets/images/home.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("CategoryList")}
        >
          <Image
            source={require("../../assets/images/target.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ChildrenList")}
        >
          <Image
            source={require("../../assets/images/report.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E7F7",
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(22),
  },
  title: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: responsiveHeight(3),
    color: "#000",
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: "600",
    marginBottom: responsiveHeight(0.8),
    color: "#000",
  },
  input: {
    height: responsiveHeight(6),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: "#fff",
    marginBottom: responsiveHeight(2),
    justifyContent: "center",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: responsiveHeight(2),
    height: responsiveHeight(6),
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#293D55",
    paddingVertical: responsiveHeight(1.8),
    borderRadius: 15,
    alignItems: "center",
    alignSelf: "center",
    width: "50%",
    marginTop: responsiveHeight(2),
  },
  saveButtonText: {
    color: "#fff",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: responsiveHeight(1.5),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: responsiveHeight(11),
    position: "absolute",
    bottom: responsiveHeight(1),
    width: "95%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    marginBottom: responsiveHeight(0.3),
    resizeMode: "contain",
  },
  navText: {
    color: "black",
    fontSize: responsiveFontSize(1.7),
    fontWeight: "600",
  },
});
