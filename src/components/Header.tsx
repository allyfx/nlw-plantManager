import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function Header() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function loadStorageUserName() {
      const userNameFromStorage = await AsyncStorage.getItem('@plantmanager:user');
      if(!userNameFromStorage)
        return;
      setUserName(userNameFromStorage);
    }
    loadStorageUserName();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <Image
        source={{
          uri: "https://avatars.githubusercontent.com/u/66289769?v=4"
        }}
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight()
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },
  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 40
  },
});
