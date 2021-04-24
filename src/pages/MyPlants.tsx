import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Alert
} from "react-native";
import { deletePlant, IPlantProps, loadPlant } from "../libs/storage";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Header } from "../components/Header";
import { PlantCardSecondary } from "../components/PlantCardSecondary";
import { Load } from "../components/Load";

import waterdropImg from "../assets/waterdrop.png";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function MyPlants() {
  const [plants, setPlants] = useState<IPlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState('');

  function handleRemove(plant: IPlantProps) {
    Alert.alert("Remover", `Deseja removera ${plant.name}?`,[
      {
        text: 'Não 🙏',
        style: "cancel",
      },
      {
        text: 'Sim 😢',
        onPress: async () => {
          setLoading(true);
          try {
            await deletePlant(plant);
            setPlants(oldPlants =>
                oldPlants.filter(item =>
                  item.id !== plant.id));
            setLoading(false);
          } catch{
            setLoading(false);
            Alert.alert("Não foi possível remover 😓");
          }
        }
      },
    ]);
  }

  useEffect(() => {
    async function loadStoragedData() {
      const plantsStoraged = await loadPlant();
      
      if (plantsStoraged[0]) {
        const nextTime = formatDistance(
          new Date(plantsStoraged[0].dateTimeNotification).getTime(),
          new Date().getTime(),
          { locale: ptBR }
        );
  
        setNextWatered(
          `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}`
        );
      } else
        setNextWatered(
          'Você ainda não tem nenhuma plantinha 😢'
        );
      
      setPlants(plantsStoraged);
      setLoading(false);
    }

    loadStoragedData();
  }, []);

  if(loading)
    return <Load />

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.spotlight}>
        <Image
          source={waterdropImg}
          style={styles.spotlightImage}
        />
        <Text style={styles.spotlightText}>
          {nextWatered}
        </Text>
      </View>
      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>
        <FlatList
          data={plants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              plant={item}
              handleRemove={() => handleRemove(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: 'justify',
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,

  },
});
