import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

import Login from "../screems/Login";

import ScorecardParameters from "../screems/ScorecardParameters";
import ScoreTableContent from "../screems/ScoreTableContent";
import ScoreTablePeriod from "../_components/ScoreTablePeriod";
import ScoreTableOrgunit from "../_components/ScoreTableOrgunit";
import ScoreTableByInd from "../_components/ScoreTableByInd";
import ScoreOrgunitByInd from "../_components/ScoreOrgunitByInd";

import i18n from "i18n-js";

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ScoreTablePeriod"
        component={ScoreTablePeriod}
        options={{
          headerShown: false,
          tabBarLabel: "Tab Period",
          //tabBarLabelStyle​: {color: '#ffffff', fontWeight: 'bold'},
          tabBarIcon: ({ color, size }) => (
            <Icon name="th-list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScoreTableByInd"
        component={ScoreTableByInd}
        options={{
          headerShown: false,
          tabBarLabel: "Tab Period Ind",
          tabBarIcon: ({ color, size }) => (
            <Icon name="list-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScoreTableOrgunit"
        component={ScoreTableOrgunit}
        options={{
          headerShown: false,
          tabBarLabel: "Tab Orgunit",
          //tabBarLabelStyle​: {color: '#ffffff', fontWeight: 'bold'},
          tabBarIcon: ({ color, size }) => (
            <Icon name="th-list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScoreOrgunitByInd"
        component={ScoreOrgunitByInd}
        options={{
          headerShown: false,
          tabBarLabel: "Tab Orgunit Ind",
          //tabBarLabelStyle​: {color: '#ffffff', fontWeight: 'bold'},
          tabBarIcon: ({ color, size }) => (
            <Icon name="list-alt" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer initialRouteName={Login}>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: i18n.t("page-login") }}
        />

        <Stack.Screen
          name="ScorecardParameters"
          component={ScorecardParameters}
          options={{ title: i18n.t("page-parameters") }}
        />
        <Stack.Screen
          name="ScoreTableContent"
          component={BottomTabNavigator}
          options={{ title: i18n.t("page-score") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
