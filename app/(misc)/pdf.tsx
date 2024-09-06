import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Image, TouchableOpacity, Modal } from 'react-native';
import { PageHeader, BackButton } from '@/components/common';
import Pdf from "@/utils/pdf";

const SCREEN_WIDTH = Dimensions.get('window').width;


const pdf: React.FC = () => {
    const onlineSource = { uri: '', cache: true };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader title="Forever" titleAlt="green" subtitle="PDF Viewer" description="Check out this sweet PDF" />
        <BackButton />
        <Pdf
            source={onlineSource}
            onLoadComplete={(numberOfPages, filePath) => {
                console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
                console.log(`current page: ${page}`);
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
        ></Pdf>

        </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  mainContent: {
    flexDirection: 'row',
    flex: 2,
    marginTop: 16,
  },
  progressBarContainer: {
    width: 30,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    transform: [{ rotate: '90deg' }],
  },
  prizesContainer: {
    flex: 1,
    marginLeft: 36,
  },
  prizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 16, // Add some padding to the right for the text
  },
  card: {
    backgroundColor: "#409858",
    padding: 12,
    borderRadius: 16,
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  grayCard: {
    backgroundColor: "#A0A0A0",
    padding: 12,
    borderRadius: 16,
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardImage: {
    backgroundColor: "white",
    borderRadius: 12,
    height: 76,
    width: 76,
  },
  
  boxText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  netZeroMonthsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  modalTextContainer: {
    flex: 1,
  },
  modalDescription: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#409858',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pdf: {
    flex:1,
    alignSelf:'stretch',

    }
});

export default pdf;