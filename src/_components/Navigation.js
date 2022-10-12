import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screems/Login";
import ChoiceParameters from "../screems/ChoiceParameters";
import GraphContent from "../screems/GraphContent";

import ScorecardParameters from "../screems/ScorecardParameters";
import ScoreTableContent from "../screems/ScoreTableContent";
import i18n from "i18n-js";

const Stack = createStackNavigator();

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
          name="Parameters"
          component={ChoiceParameters}
          options={{ title: "Choice of parameters" }}
        />
        <Stack.Screen
          name="Charts"
          component={GraphContent}
          options={{ title: "Dashboard" }}
        />
        <Stack.Screen
          name="ScorecardParameters"
          component={ScorecardParameters}
          options={{ title: i18n.t("page-parameters") }}
        />
        <Stack.Screen
          name="ScoreTableContent"
          component={ScoreTableContent}
          options={{ title: i18n.t("page-score") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
