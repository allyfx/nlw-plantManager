import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Welcome } from "../pages/Welcome";
import { UserIdentification } from "../pages/UserIdentification";
import { Confirmation } from "../pages/Confirmation";
import { PlantSave } from "../pages/PlantSave";

import colors from "../styles/colors";
import AuthRoutes from "./tab.routes";

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  
  useEffect(() => {
    async function loadUserName() {
      const userNameFromStorage = await AsyncStorage
        .getItem('@plantmanager:user');
      
      if (userNameFromStorage)
        setIsLogged(true);
    }

    loadUserName();
  }, []);

  return (
    <stackRoutes.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.white
        }
      }}
    >
      {!isLogged && (
        <>
          {/* Initialization */}

          <stackRoutes.Screen
            name="Welcome"
            component={Welcome}
          />
          <stackRoutes.Screen
            name="UserIdentification"
            component={UserIdentification}
          />
          <stackRoutes.Screen
            name="Confirmation"
            component={Confirmation}
          />
        </>
      )}

      {/* Plants */}

      <stackRoutes.Screen
        name="PlantSelect"
        component={AuthRoutes}
      />
      <stackRoutes.Screen
        name="PlantSave"
        component={PlantSave}
      />
      <stackRoutes.Screen
        name="MyPlants"
        component={AuthRoutes}
      />
    </stackRoutes.Navigator>
  )
};

export default AppRoutes;
