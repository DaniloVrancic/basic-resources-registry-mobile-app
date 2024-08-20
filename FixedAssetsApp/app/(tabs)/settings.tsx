import { StyleSheet, View } from 'react-native';



import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"

import i18next from '@/services/i18next';
import { languageResources } from '@/services/i18next';
import languagesList from '@/services/languagesList.json'
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function Settings() {

  type LanguageCodes = keyof typeof languagesList;

  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language);

  const handleLanguageChange = (langCode: LanguageCodes) => {
    setSelectedLanguage(langCode);
    i18next.changeLanguage(langCode);
  };


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="settings" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{i18next.t('tabs.settings')}</ThemedText>

        <ThemedView style={styles.languageContainer}>
          <ThemedText type="subtitle" style={{marginBottom: 15}}>{i18next.t('settings.chooseLanguage')}</ThemedText>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => handleLanguageChange(itemValue as LanguageCodes)}
            style={styles.picker}
          >
            {Object.keys(languageResources).map((langCode: any) => (
              <Picker.Item
                key={langCode}
                label={languagesList[langCode as LanguageCodes].nativeName || langCode}
                value={langCode}
              />
            ))}
          </Picker>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute', //Always let the title stay in the same position
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
    padding: 6,
    textAlign: 'center',
  },
  languageContainer: {
    justifyContent:'center',
    alignItems:'center',
    marginTop: 20,
  },
  picker: {
    height: 50,
    width: 200,
    backgroundColor: '#fff',
  },
});