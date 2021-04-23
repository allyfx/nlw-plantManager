import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Platform,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button } from "../components/Button";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function UserIdentification() {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [name, setName] = useState('');

  function toggleIsFocused() {
    setIsFocused(!isFocused);
  }

  function handleChange(value: string) {
    setName(value);
  }

  async function handleSubmit() {
    if(!name)
      return Alert.alert("Me diz como chamar você 😢");

    try {
      await AsyncStorage.setItem("@plantmanager:user", name);
    
      navigation.navigate('Confirmation', {
        buttonTitle: 'Começar',
        icon: 'smile',
        nextScreen: 'PlantSelect',
        subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidados.',
        title: 'Prontinho'
      });
    } catch {
      Alert.alert("Não foi possível salvar o seu nome 😢")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.emoji}>
                  { !name ? '😃' : '😄' }
                </Text>
                <Text style={styles.title}>
                  Como podemos {'\n'}
                  chamar você?
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  (isFocused || name !== '') && { borderColor: colors.green }
                ]}
                placeholder="Digite um nome"
                onChangeText={handleChange}
                onBlur={toggleIsFocused}
                onFocus={toggleIsFocused}
              />
              <View style={[
                styles.footer,
                !name && { opacity: 0.5 }
              ]}>
                <Button
                  disabled={!name}
                  onPress={handleSubmit}
                >
                  Confirmar
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
    width: '100%'
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center'
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center'
  },
  footer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20,
  }
});
