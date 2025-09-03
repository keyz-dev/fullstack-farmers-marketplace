import React from 'react'
import { COLORS } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from '../components'
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useFavorites } from '../stateManagement/contexts';
import { FavoritesTile } from '../components/favorites';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  return (
    <SafeAreaView>
      <Header title={"Favorites"}/>
      <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>You have no favorite products yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <FavoritesTile product={item} onRemove={removeFromFavorites} />
          )}
        />
      )}
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  emptyText: { fontSize: 18, textAlign: 'center', fontFamily: 'regular', marginTop: 50, color: '#666' },
});


export default Favorites