import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/core";

import api from "../services/api";

import { Header } from "../components/Header";
import { EnviromentButton } from "../components/EnviromentButton";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";

import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { IPlantProps } from "../libs/storage";

interface IEnviroment {
  key: string;
  title: string;
}

export function PlantSelect() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [selectedEnviroment, setSelectedEnviroment] = useState('all');
  const [enviroments, setEnviroments] = useState<IEnviroment[]>([]);
  const [plants, setPlants] = useState<IPlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<IPlantProps[]>([]);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  async function fetchPlants() {
    try {
      const { data } = await api
        .get(`/plants?_sort=name&_order=asc&_page=${page}&_limit=8`);
      
      if (!data) return setLoading(false);

      if (page > 1) {
        setPlants(oldValue => [...oldValue, ...data]);
        setFilteredPlants(oldValue => [...oldValue, ...data]);
      } else {
        setPlants(data);
        setFilteredPlants(data);
      }
      
      setLoading(false);
      setLoadingMore(false);
    } catch(err) {
      console.log(err);
    }
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: IPlantProps) {
    navigation.navigate('PlantSave', { plant });
  }

  useEffect(() => {
    let newFilteredPlants = plants.filter((plant) => plant.environments.includes(selectedEnviroment));
    
    if (selectedEnviroment === 'all') {
      newFilteredPlants = plants;
    }

    setFilteredPlants(newFilteredPlants);
  }, [selectedEnviroment]);

  useEffect(() => {
    async function fetchEnviroment() {
      try {
        const { data } = await api
          .get('/plants_environments?_sort=title&_order=asc');
        setEnviroments([
          {
            key: "all",
            title: "Todas",
          },
          ...data
        ]);
      } catch(err) {
        console.log(err);
      }
    }

    fetchPlants();
    fetchEnviroment();
  }, []);

  if (loading) return <Load />

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>
      <View>
        <FlatList
          data={enviroments}
          renderItem={({ item }) => (
            <EnviromentButton
              title={item.title}
              active={selectedEnviroment === item.key}
              onPress={() => setSelectedEnviroment(item.key)}
            />
          )}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>
      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantCardPrimary
              plant={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator color={colors.green} />
              : <></>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    width: '100%',
    paddingHorizontal: 30
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading
  },
  enviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    paddingLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
});
