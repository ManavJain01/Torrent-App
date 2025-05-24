// app/(tabs)/projects.tsx
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import axios from 'axios';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import ShowTorrents from '@/components/torrent/ShowTorrents';

// const be_link = 'http://localhost:5000'
const be_link = 'http://10.0.2.2:5000'

const socket = io(be_link, {
  transports: ['websocket'],
});


export default function TorrentScreen() {
  const [magnet, setMagnet] = useState('');
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    const onConnect = () => {
      console.log('Socket connected');
    };

    const onDisconnect = () => {
      console.log('Socket disconnected');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('progress', data => {
      setProgressList(prevList => {
        const existing = prevList.find(t => t.name === data.name);
        if (existing) {
          return prevList.map(t =>
            t.name === data.name ? { ...t, ...data } : t
          );
        } else {
          return [...prevList, data];
        }
      });
    });
  
    socket.on('done', data => alert(`Download completed: ${data.name}`));

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('progress');
      socket.off('done');
    };
  }, []);

  // Funtions
  const isValidMagnet = (link) => /^magnet:\?xt=urn:btih:[a-fA-F0-9]{40,}.*$/.test(link);

  const startDownload = async () => {
    try {
      if (!isValidMagnet(magnet)) {
        alert('Invalid Magnet Link');
        return;
      }
      console.log("starting...");
      

      const res = await axios.post(`${be_link}/torrent`, { magnetURI: magnet });
      console.log("torrent added");

      setMagnet('');
    } catch (error) {
      console.error("error occured while downloading: ", error);
    }
  };

  const getTorrents = async () => {
    try {
      const res = await axios.get(`${be_link}/torrent`);
      console.log("res: ", res.data);
      setProgressList(res.data);
    } catch (error) {
      console.error("error occured while downloading: ", error);
    }
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Torrent Page</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Magnet Link"
          value={magnet}
          onChangeText={setMagnet}
        />
        <Button title="Get All Torrents" onPress={getTorrents} />
        <Button title="Download" onPress={startDownload} />
        {/* {progressList.map((torrent, index) => (
          <View key={index} style={{ marginVertical: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{torrent.name}</Text>
            <Text>Progress: {torrent.progress}%</Text>
            <Text>{(torrent.downloaded / 1024 / 1024).toFixed(2)} MB / {(torrent.total / 1024 / 1024).toFixed(2)} MB</Text>
          </View>
        ))} */}

        <ShowTorrents progressList={progressList} setProgressList={setProgressList} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 },
});