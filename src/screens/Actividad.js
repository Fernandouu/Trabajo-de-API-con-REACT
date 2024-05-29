import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TextInput, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import md5 from 'md5';

const WIDTH = Dimensions.get('window').width;
const numColumns = 2;

export default function Actividad() {
    const [characterList, setCharacterList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCharacterList = async () => {
        try {
            setLoading(true);
            const ts = '1000';
            const publicKey = '7ec8cab35b41cc703ccf2a43e71cf599';
            const privateKey = '75b3e311a56b401d6427c8685c60b7cd5aa3c972';
            const hash = md5(`${ts}${privateKey}${publicKey}`);
            const response = await axios.get(`http://gateway.marvel.com/v1/public/characters`, {
                params: {
                    ts,
                    apikey: publicKey,
                    hash,
                    nameStartsWith: searchQuery
                }
            });
            setCharacterList(response.data.data.results);
        } catch (error) {
            console.log("Hubo un error obteniendo la lista de personajes", error);
            Alert.alert("Error", "Hubo un error obteniendo la lista de personajes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            fetchCharacterList();
        }
    }, [searchQuery]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: `${item.thumbnail.path}.${item.thumbnail.extension}` }} style={styles.image} />
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.description || 'No description available.'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.formulario}>
                <Text style={styles.header}>Buscar Personaje de Marvel</Text>
                <TextInput
                    style={[styles.input, { marginTop: 10 }]}
                    placeholder='Buscar por nombre'
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
            </View>
            {loading ? (
                <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={characterList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={numColumns}
                    contentContainerStyle={styles.list}
                    style={styles.flatList}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formulario: {
        padding: 20,
        backgroundColor: '#f1f1f1',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    list: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    flatList: {
        flex: 1,
    },
    card: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        margin: 5,
        width: WIDTH / numColumns - 10,
        alignItems: 'center',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5,
        textTransform: 'capitalize',
    },
    description: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 5,
    },
    image: {
        width: 80,
        height: 120,
    },
    loading: {
        marginTop: 20,
    },
});
