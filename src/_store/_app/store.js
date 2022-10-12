import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../_feature/user.slice";
import dataStoreReducer from "../_feature/dataStore.slice";
import orgunitReducer from "../_feature/orgunit.slice";
import chartReducer from "../_feature/chart.slice";

export default configureStore({
  reducer: {
    user: userReducer,
    dataStore: dataStoreReducer,
    orgunit: orgunitReducer,
    chart: chartReducer,
  },
});
