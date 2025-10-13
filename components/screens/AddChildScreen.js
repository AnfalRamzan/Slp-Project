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
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function AddChildScreen({ navigation }) {
  const [childName, setChildName] = useState("");
  const [mrNumber, setMrNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [parentName, setParentName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔽 Increased top margin for better visual balance */}
        <View style={{ marginTop: responsiveHeight(6) }}>
          <Text style={styles.title}>Add Child</Text>

          <Text style={styles.label}>Child Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Child Name"
            placeholderTextColor="#777"
            value={childName}
            onChangeText={setChildName}
          />

          <Text style={styles.label}>MR Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter MR Number"
            placeholderTextColor="#777"
            value={mrNumber}
            onChangeText={setMrNumber}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Date of Birth"
            placeholderTextColor="#777"
            value={dob}
            onChangeText={setDob}
          />

          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Gender"
            placeholderTextColor="#777"
            value={gender}
            onChangeText={setGender}
          />

          <Text style={styles.label}>Parent / Guardian Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Parent / Guardian Name"
            placeholderTextColor="#777"
            value={parentName}
            onChangeText={setParentName}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => navigation.navigate("GoalTracking")}
          >
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Bottom Navigation Bar */}
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
          onPress={() => navigation.navigate("GoalTracking")}
        >
          <Image
            source={require("../../assets/images/target.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../../assets/images/presentation.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Sessions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../../assets/images/report.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Report</Text>
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
    fontSize: responsiveFontSize(1.9),
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
