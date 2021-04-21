import React from "react";
import {
  Text,
  StyleSheet
} from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { SvgFromUri } from "react-native-svg";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface IPlantCardPrimaryProps extends RectButtonProps {
  plant: {
    name: string;
    photo: string;
  }
}

export function PlantCardPrimary({ plant, ...rest }: IPlantCardPrimaryProps) {
  return (
    <RectButton
      {...rest}
      style={styles.container}
    >
      <SvgFromUri
        uri={plant.photo}
        width={70}
        height={70}
      />
      <Text style={styles.text}>
        { plant.name }
      </Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: '45%',
    backgroundColor: colors.shape,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    margin: 10,
  },
  text: {
    color: colors.green_dark,
    fontFamily: fonts.heading,
    marginVertical: 16
  },
});
