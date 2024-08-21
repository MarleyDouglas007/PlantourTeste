import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavBar from './BottomNavBar';
import { collection, getDocs } from "firebase/firestore";
import { db } from './../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

const Explorar = () => {
  const router = useRouter();
  const [publicacoes, setPublicacoes] = useState([]);
  const [configModalVisible, setConfigModalVisible] = useState(false);

  const openConfigModal = () => {
    setConfigModalVisible(true);
  };

  const closeConfigModal = () => {
    setConfigModalVisible(false);
  };

  useEffect(() => {
    const fetchPublicacoes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "publicacoes"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPublicacoes(data);
      } catch (error) {
        console.error('Erro ao buscar publicações:', error);
      }
    };

    fetchPublicacoes();
  }, []);

  const renderPublicacoesPorTipo = (tipo) => {
    return publicacoes
      .filter(pub => pub.tipo === tipo)
      .map((pub, index) => (
        <TouchableOpacity 
        key={index} 
        style={styles.card} 
        onPress={() => router.push({
          pathname: '/CardDetalhes',
          params: { 
            imagemUrl: pub.imagemUrl,
            titulo: pub.titulo,
            valor: pub.valor,
            descricao: pub.descricao,
            endereco: pub.endereco,
            tipo: pub.tipo,
            id: pub.id
          }
        })}
      >
          {pub.imagemUrl ? (
            <Image source={{ uri: pub.imagemUrl }} style={styles.cardImage} />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>Sem Imagem</Text>
            </View>
          )}
          <Text style={styles.cardTitle}>{pub.titulo}</Text>
          <Text style={styles.cardDescription}>{pub.descricao}</Text>
        </TouchableOpacity>
      ));
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Plantour</Text>
            <TouchableOpacity onPress={openConfigModal}>
              <Image source={require('../assets/configuracao.png')} style={styles.configuracao} />
            </TouchableOpacity>
            <View style={styles.buttonWrapper}>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonTextB}>Restaurantes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonTextB}>Roteiros</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.buttonHotel}>
                <Text style={styles.buttonTextB}>Hotéis</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.textoTitulo}>Restaurantes</Text>
          <View style={styles.cardContainer}>
            {renderPublicacoesPorTipo('restaurante')}
          </View>

          <Text style={styles.textoTitulo}>Hotéis</Text>
          <View style={styles.cardContainer}>
            {renderPublicacoesPorTipo('hotel')}
          </View>

          <Text style={styles.textoTitulo}>Bares</Text>
          <View style={styles.cardContainer}>
            {renderPublicacoesPorTipo('bar')}
          </View>

          <Text style={styles.textoTitulo}>Pontos Turísticos</Text>
          <View style={styles.cardContainer}>
            {renderPublicacoesPorTipo('Ponto Turístico')}
          </View>

          <Text style={styles.textoTitulo}>Cafeterias</Text>
          <View style={styles.cardContainer}>
            {renderPublicacoesPorTipo('cafeteria')}
          </View>

          <Text style={styles.textoTitulo}>Passeios</Text>
          <View style={styles.cardContainer}>
            {renderPublicacoesPorTipo('Passeio')}
          </View>
        </View>
      </ScrollView>
      <BottomNavBar />

      <Modal
        animationType="slide"
        transparent={true}
        visible={configModalVisible}
        onRequestClose={closeConfigModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.configOption} onPress={closeConfigModal}>
              <Icon name="moon-o" size={20} color="#000" style={styles.configIcon} />
              <Text style={styles.configOptionText}>Modo escuro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.configOption} onPress={closeConfigModal}>
              <Icon name="user" size={20} color="#000" style={styles.configIcon} />
              <Text style={styles.configOptionText}>Conta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.configOption} onPress={closeConfigModal}>
              <Icon name="heart" size={20} color="#000" style={styles.configIcon} />
              <Text style={styles.configOptionText}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.configOption} onPress={closeConfigModal}>
              <Icon name="lock" size={20} color="#000" style={styles.configIcon} />
              <Text style={styles.configOptionText}>Privacidade e Segurança</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.configOption} onPress={closeConfigModal}>
              <Icon name="bell" size={20} color="#000" style={styles.configIcon} />
              <Text style={styles.configOptionText}>Notificações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.configOption} onPress={closeConfigModal}>
              <Icon name="question-circle" size={20} color="#000" style={styles.configIcon} />
              <Text style={styles.configOptionText}>Ajuda e Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.configOption, { borderColor: 'red' }]} onPress={closeConfigModal}>
              <Icon name="sign-out" size={20} color="red" style={styles.configIcon} />
              <Text style={[styles.configOptionText, { color: 'red' }]}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeConfigModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // (mesmos estilos do código anterior)
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#2D9AFF',
    padding: 20,
    paddingBottom: 40, // Ajuste para acomodar os botões
    position: 'relative',
  },
  configuracao: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 20,
    top: 10,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 10,
    position: 'absolute',
    left: 20,
    top: 20,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80, // Ajuste a margem superior para posicionar os botões abaixo do nome
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '45%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHotel: {
    width: '45%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextB: {
    fontWeight: 'bold',
    color: '#3A3A3A',
    fontSize: 17,

  },
  textoTitulo: {
    width: '90%',
    color: '#242424',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  noImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  noImageText: {
    color: '#888',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
    paddingBottom: 0,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    padding: 10,
    paddingTop: 5,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    backgroundColor: '#2D9AFF',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  configOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  configIcon: {
    marginRight: 10,
  },
  configOptionText: {
    fontSize: 16,
  },
});

export default Explorar;