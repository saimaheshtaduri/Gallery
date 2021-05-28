import React from "react";
import {
  FlatList,
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Component } from "react";
import { vw, vh } from "react-native-expo-viewport-units";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";

export default class Images extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isVis: false,
      img: "",
    };
  }

  async fetchData() {
    let name = 1;
    try {
      let resp = await fetch(
        "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s"
      );
      var respjson = await resp.json();
      var pics = respjson.photos.photo;
      let paths = [];

      pics.map(async (item) => {
        let path = FileSystem.cacheDirectory + name.toString();
        name += 1;
        let present = await FileSystem.getInfoAsync(path);
        if (present.exists) {
          await FileSystem.deleteAsync(present.uri).catch((error) => {
            console.error(error);
          });
        }
        FileSystem.downloadAsync(item.url_s, path)
          .then(({ uri }) => {
            paths.push(uri);
            this.setState({ data: paths });
          })
          .catch((error) => {
            console.error(error);
          });
      });
    } catch (e) {
      Alert.alert(
        "No Connection",
        "PLease Turn on the Internet to update Images",
        [
          {
            text: "Try Again",
            onPress: () => this.fetchData(),
          },
          { text: "Ok" },
        ]
      );
      let paths = [];
      for (let i = 1; i <= 20; i++) {
        let path = FileSystem.cacheDirectory + i.toString();
        let present = await FileSystem.getInfoAsync(path);
        if (await present.exists) {
          console.warn(path);
          paths.push(path.toString());
          this.setState((prev) => ({
            data: paths,
            isVis: prev.isVis,
            img: prev.img,
          }));
        } else {
          console.warn("Cache Loading Error");
        }
      }
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    clickHander = (url) => {
      this.setState((prev) => ({
        data: prev.data,
        isVis: true,
        img: url,
      }));
    };

    return (
      <>
        <Modal visible={this.state.isVis} transparent={true}>
          <View style={styles.modal}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  data: this.state.data,
                  isVis: false,
                  img: this.state.img,
                })
              }
            >
              <Ionicons
                name="close-circle-outline"
                size={74}
                color="white"
                style={styles.closeicon}
              />
            </TouchableOpacity>
            <Image source={{ uri: this.state.img }} style={styles.pic} />
          </View>
        </Modal>

        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Ionicons
                style={{ marginLeft: 10, marginRight: 25 }}
                name="arrow-back"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <Text style={styles.head}>Images</Text>
          </View>
          <FlatList
            style={{ paddingVertical: 8 }}
            numColumns={4}
            data={this.state.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(pic) => (
              <TouchableOpacity onPress={() => clickHander(pic.item)}>
                <Image
                  style={{
                    width: (vw(100) - 25) / 4,
                    height: (vh(100) - 25) / 4,
                    margin: 3,
                  }}
                  source={{ uri: pic.item }}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  head: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  header: {
    alignItems: "center",
    width: vw(100),
    backgroundColor: "rgb(102, 153, 255)",
    paddingTop: 65,
    paddingBottom: 10,
    flexDirection: "row",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  pic: {
    height: 500,
    width: 300,
    borderRadius: 20,
  },
  closeicon: {
    top: -50,
  },
});
