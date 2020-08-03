export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyD2fHs-Gwq4AXLiNkhpPyEk03l_RFC7dBs",
    authDomain: "mr-parkir.firebaseapp.com",
    databaseURL: "https://mr-parkir.firebaseio.com/",
    projectId: "mr-parkir",
    storageBucket: "mr-parkir.appspot.com"
  };

  export const snapshotToArray = snapshot => {
      let returnArray = [];
      snapshot.forEach(element => {
          let item = element.val();
          item.key = element.key;
          returnArray.push(item);
      });
      return returnArray;
  }