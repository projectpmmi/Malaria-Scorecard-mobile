import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("dashboard.db");

export const createTable = async () => {
  await db.transaction((tx) => {
    /* tx.executeSql(
        "drop table if  exists user;"
      ); */
    tx.executeSql(
      "create table if not exists user (login	TEXT,pwd TEXT,url TEXT);"
    );
    tx.executeSql(
      "create table if not exists orgunit (url TEXT , value TEXT);"
    );
    tx.executeSql(
      "create table if not exists datastore (url TEXT , value TEXT);"
    );
    tx.executeSql(
      "create table if not exists graph_data (login_user	TEXT,pwd_user	TEXT,url	TEXT,uidOu	TEXT,group_ind	TEXT,value	TEXT);"
    );
  });
  //console.log("============Table create===========")
};

export const saveOrgunit = async (url, listOrgunit) => {
  await createTable();

  await db.transaction((tx) => {
    tx.executeSql(
      "select * from orgunit where url=?;",
      [url],
      async (_, { rows }) => {
        //console.log(JSON.stringify("==========rows save=========="+JSON.stringify(rows)))
        //rows.length
        if (rows.length > 0) {
          //console.log("Je suis ici orgunit")
          await db.transaction((tx) => {
            tx.executeSql("update orgunit set value = ? where url = ?;", [
              JSON.stringify(listOrgunit),
              url,
            ]);
          });
        } else {
          //console.log("Je suis la orgunit")
          await db.transaction((tx) => {
            tx.executeSql("insert into orgunit (url,value) values (?,?)", [
              url,
              JSON.stringify(listOrgunit),
            ]);
          });
        }
      }
    );
  });
};

/* export const getOrgunit=async (url,setOrgunit)=>{
  
  await db.transaction(tx => {
    tx.executeSql("select * from orgunit where url=?;", [url], async (_, { rows }) =>{
      //console.log("========test==========="+JSON.stringify(test))
      //console.log("========rows orgunit==========="+rows._array[0].value)
      if(rows.length>0)await setOrgunit(JSON.parse(rows._array[0].value))
    });
  });
} */

export const getOrgunit = async (url) =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from orgunit where url=?;",
        [url],
        function (tx, { rows }) {
          if (rows.length > 0) {
            resolve(JSON.parse(rows._array[0].value));
          } else {
            resolve([]);
          }
        },
        function (tx, error) {
          reject("Error SELECT : ", error.message);
        }
      );
    });
  });

export const getAllOrgunit = async (setOrgunit) => {
  await db.transaction((tx) => {
    tx.executeSql("select * from orgunit ;", null, async (_, { rows }) => {
      //console.log("========test==========="+JSON.stringify(test))
      //await console.log("========rows all orgunit===========",JSON.stringify(rows._array))
      if (rows.length > 0) await setOrgunit(rows._array); //object javascript
    });
  });
};

export const saveDataStore = async (url, dataStore) => {
  await createTable();

  await db.transaction((tx) => {
    tx.executeSql(
      "select * from datastore where url=?;",
      [url],
      async (_, { rows }) => {
        //await console.log("rows",JSON.stringify(rows))

        if (rows.length > 0) {
          console.log("Je suis la datastore");
          await db.transaction((tx) => {
            tx.executeSql("update datastore set value = ? where url = ?;", [
              JSON.stringify(dataStore),
              url,
            ]);
          });
        } else {
          console.log("Je suis ici");
          await db.transaction((tx) => {
            tx.executeSql("insert into datastore (url,value) values (?,?);", [
              url,
              JSON.stringify(dataStore),
            ]);
          });
        }
      }
    );
  });
};

export const getDataStore = async (url) =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from datastore where url=?;",
        [url],
        function (tx, { rows }) {
          if (rows.length > 0) {
            resolve(JSON.parse(rows._array[0].value));
          } else {
            resolve([]);
          }
        },
        function (tx, error) {
          reject("Error SELECT : ", error.message);
        }
      );
    });
  });

export const saveUser = async (user) => {
  await createTable();
  //console.log("==========save user==========" + JSON.stringify(user));
  await db.transaction((tx) => {
    tx.executeSql(
      "select * from user where login=? and pwd=? and url=?;",
      [user.login, user.pwd, user.url],
      async (_, { rows }) => {
        //console.log("============user rows===========", rows.length);

        if (rows.length == 0) {
          console.log("user Je suis ici");
          //console.log("=========user.login =========="+user.login)
          await db.transaction((tx) => {
            tx.executeSql("insert into user (login,pwd,url) values (?,?,?);", [
              user.login,
              user.pwd,
              user.url,
            ]);
          });
        }
      }
    );
  });
};

export const getUser = async (user) =>
  new Promise((resolve, reject) => {
    //console.log("======== user in getuser sdb===========",user)
    db.transaction((tx) => {
      tx.executeSql(
        "select * from user where login=? and pwd=? and url=?;",
        [user.login, user.pwd, user.url],
        function (tx, { rows }) {
          //console.log("======== rows in getuser sdb===========",JSON.stringify(rows._array[0]))
          if (rows.length > 0) {
            resolve(rows._array);
          } else {
            resolve([]);
          }
        },
        function (tx, error) {
          reject("Error SELECT : ", error.message);
        }
      );
    });
  });

export const getAllUser = async (listUser) => {
  //console.log("======== user in getuser==========="+JSON.stringify(user))
  await db.transaction((tx) => {
    tx.executeSql("select * from user ;", null, async (_, { rows }) => {
      //await console.log("========rows getAllUser===========",JSON.stringify(rows._array))
      await listUser(JSON.stringify(rows._array));
    });
  });
};

export const getLasttUrl = async () => {
  await createTable();
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from user ;",
        null,
        function (tx, results) {
          //console.log("======la view ici======");
          let listUser = results.rows._array;
          let taille = listUser.length;
          /* console.log(
            "==========results a voir 2==========",
            JSON.stringify(results)
          ); */
          if (taille > 0) resolve(listUser[taille - 1].url);
          else {
            resolve(null);
          }
        },
        function (tx, error) {
          reject("Error SELECT : ", error.message);
        }
      );
    });
  });
};

export const getLasttUser = async () => {
  await createTable();
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from user ;",
        null,
        function (tx, results) {
          console.log(
            "==========Last User a voir ==========",
            results.rowsAffected
          );
          let listUser = results.rows._array;
          let taille = listUser.length;

          if (taille > 0) resolve(listUser[taille - 1]);
          else {
            resolve(null);
          }
        },
        function (tx, error) {
          reject("Error SELECT USER : ", error);
        }
      );
    });
  });
};

export const saveGraphData = async (graphData) => {
  await createTable();
  //console.log("=========graphData=======", JSON.stringify(graphData.value));

  await db.transaction((tx) => {
    tx.executeSql(
      "select * from graph_data where url=? and uidOu=?  and group_ind=?;",
      [graphData.url, graphData.uidOu, graphData.group_ind],
      async (_, { rows }) => {
        //console.log("============row graphdata===========" + rows.length);

        if (rows.length > 0) {
          //console.log("Je suis la graphdata");
          await db.transaction((tx) => {
            tx.executeSql(
              "update graph_data set value = ? where url=? and uidOu=?  and group_ind=?;",
              [
                JSON.stringify(graphData.value),
                graphData.url,
                graphData.uidOu,
                graphData.group_ind,
              ]
            );
          });
        } else {
          console.log("Je suis ici graphdata");
          await db.transaction((tx) => {
            tx.executeSql(
              "insert into graph_data (url,uidOu,group_ind,value) values (?,?,?,?);",
              [
                graphData.url,
                graphData.uidOu,
                graphData.group_ind,
                JSON.stringify(graphData.value),
              ]
            );
          });
        }
      }
    );
  });
};

/* export const getGraphData=async (graphData,setChartsData)=>{
  
  await db.transaction(tx => {
    tx.executeSql("select * from graph_data where url=? and uidOu=? and period=? and group_ind=?;", [graphData.url,graphData.uidOu,graphData.period,graphData.group_ind], async (_, { rows }) =>{
      //console.log("========test==========="+JSON.stringify(test))
      //await console.log("========rows getGraphData==========="+JSON.stringify(await rows._array[0]))
      if(rows.length>0) {
        await setChartsData(await JSON.parse(rows._array[0].value))
      }else{
        setChartsData([])
      }
      await console.log("========finish===========")
    });
  });
}
 */

export const getGraphData = async (graphData) =>
  new Promise((resolve, reject) => {
    //console.log("======== graphData DB===========", graphData);
    db.transaction((tx) => {
      tx.executeSql(
        "select * from graph_data where url=? and uidOu=?  and group_ind=?;",
        [graphData.url, graphData.uidOu, graphData.group_ind],
        function (tx, { rows }) {
          //console.log("======== rows in getGraphData sdb===========",JSON.stringify(rows._array[0]))
          if (rows.length > 0) {
            resolve(JSON.parse(rows._array[0].value));
          } else {
            resolve([]);
          }
        },
        function (tx, error) {
          reject("Error SELECT : ", error.message);
        }
      );
    });
  });

export const getAllGraphData = async (setChartsData) => {
  await db.transaction((tx) => {
    tx.executeSql("select * from graph_data ;", null, async (_, { rows }) => {
      //await console.log("========rows all getGraphData==========="+JSON.stringify(rows._array))
      await setChartsData(rows._array);
    });
  });
};
