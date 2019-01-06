import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Picker } from 'react-native';
import { USER_SPARK_LIST_PATH_API } from './../endpoints';
const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: '#2C2649',
    padding: 10,
  },
  sortPicker: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
  },
  sparkTile: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  sparkTileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  sparkTileTitle: {
    fontSize: 17,
    color: '#000000',
    width: '75%'
  },
  sparkTileToken: {
    fontSize: 18,
    color: '#9600A1'
  },
  sparkTileDate: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 13
  },
  sparkTileUser: {
    color: '#1FBEB8',
    fontSize: 15
  }
});

let userId = null;
let profile = null;
let endpoint = USER_SPARK_LIST_PATH_API;

function getDateFromTimestamp(timestamp) {
  if (!timestamp) return null;
  let dateObj = new Date(timestamp);
  return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
}

function sortByKey(array, key) {
  return array.sort((a, b) => {
    const x = a[key]; const y = b[key];
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}

export default class SparkView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sparks: this.props.sparks,
      refreshing: false,
      sorter: '',
    }
    userId = this.props.user._id || null;
    profile = this.props.user.profile || null;
    endpoint = endpoint.replace('{}', userId);
  }

  componentWillMount() {
    if (!this.props.sparks.length) {
      this.props.sparkActions.getSparksRequest({ initialLoad: true, endpoint });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sparks.length != this.props.sparks.length) {
      this.setState({ sparks: nextProps.sparks });
    }
  }

  _renderItem = ({ item, index }) => {
    const { source } = item;
    const key = Object.keys(source)[0];
    return (
      <View style={styles.sparkTile}>
        <View style={{ ...styles.sparkTileRow, ...{ 'paddingBottom': 10 } }}>
          <Text style={styles.sparkTileTitle}>{source[key].name}</Text>
          <Text style={styles.sparkTileToken}>{`+${item.numTokens} Token`}</Text>
        </View>
        <View style={styles.sparkTileRow}>
          <Text style={styles.sparkTileDate}>{getDateFromTimestamp(item.timestamp)}</Text>
          <Text style={styles.sparkTileUser}>{profile ? `${profile.firstName} ${profile.lastName}` : ''}</Text>
        </View>
      </View>
    )
  }

  handleRefresh() {
    this.props.sparkActions.getSparksRequest({ endpoint });
  }

  handleSortChange(sorter) {
    let data = sortByKey(this.state.sparks, sorter);
    this.setState({ sorter, sparks: data });
  }

  render() {
    return (
      <View style={styles.contentView}>
        <Picker
          selectedValue={this.state.sorter}
          style={styles.sortPicker}
          onValueChange={(itemValue, itemIndex) => this.handleSortChange(itemValue)}
        >
          <Picker.Item label="Sort by" value="" />
          <Picker.Item label="Date" value="timestamp" />
          <Picker.Item label="House" value="_id" />
          <Picker.Item label="Tokens" value="numTokens" />
        </Picker>
        <View style={{ flex: 1, paddingVertical: 10 }}>
          <FlatList
            data={this.state.sparks}
            keyExtractor={(item) => item._id}
            renderItem={this._renderItem}
            refreshing={this.state.refreshing}
            onRefresh={() => this.handleRefresh()}
          />
        </View>
      </View>
    );
  }
}
