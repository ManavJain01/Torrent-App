// Components
import { Button, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import axios from 'axios';


const be_link = 'http://10.0.2.2:5000'

export default function ShowTorrents({
  progressList,
  setProgressList
}) {
  // const [progressList, setProgressList] = useState([]);

  // Functions
  const pauseTorrent = async (infoHash: string) => {
    console.log("infoHash: ", infoHash);
    
    await axios.post(`${be_link}/torrent/pause`, { infoHash });
  };

  const resumeTorrent = async (infoHash: string) => {
    await axios.post(`${be_link}/torrent/resume`, { infoHash });
  };

  const deleteTorrent = async (infoHash: string) => {
    await axios.post(`${be_link}/torrent/delete`, { infoHash });
    setProgressList(prev => prev.filter(t => t.infoHash !== infoHash));
  };



  return progressList.map((torrent, index: number) => (
    // <View style={styles.container}>
    <View key={index} style={{ marginVertical: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{torrent.name}</Text>
      <Text>Progress: {torrent.progress}%</Text>
      <Text>{(torrent.downloaded / 1024 / 1024).toFixed(2)} MB / {(torrent.total / 1024 / 1024).toFixed(2)} MB</Text>

      <View style={styles.buttonContainer}>
        <Button title="Pause" onPress={() => pauseTorrent(torrent.infoHash)} />
        <Button title="Resume" onPress={() => resumeTorrent(torrent.infoHash)} />
        <Button title="Delete" onPress={() => deleteTorrent(torrent.infoHash)} />
      </View>
    </View>
  ));
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20
  }
});