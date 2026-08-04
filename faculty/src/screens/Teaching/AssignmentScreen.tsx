import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRoute } from '@react-navigation/native';

const COLORS = {
  background: '#F8FAFC',
  primary: '#1A3C5A',
  secondary: '#64748B',
  accent: '#F97316',
  white: '#FFF',
  lightRed: '#FFF5F5',
  red: '#EF4444',
  lightBlue: '#F1F5F9',
  blue: '#1A3C5A',
  grayLight: '#CBD5E1',
  grayDark: '#334155',
};

export const AssignmentScreen = () => {
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [answer, setAnswer] = useState('');

  const { title, date, student, assignmentId } = route.params as any;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📅 {date}</Text>
          <Text style={styles.metaText}>👤 {student}</Text>
        </View>

        <View style={styles.orangeLine} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          A presentation on advanced robotics and automation for Assignment ID:{' '}
          {assignmentId}.
        </Text>

        <TouchableOpacity style={styles.downloadCard}>
          <Text style={styles.downloadText}>Download File</Text>
          <Text style={styles.downloadIcon}>📥</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 80) }]}
      >
        <TouchableOpacity style={[styles.button, styles.deleteButton]}>
          <Text style={styles.deleteButtonText}>🗑 Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.answerButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.answerButtonText}>💬 Answer</Text>
        </TouchableOpacity>
      </View>

      {/* Answer Modal (image_9301b4.png) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            {/* Drag Handle & Close */}
            <View style={styles.dragHandle} />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeHeader}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

            <Text style={styles.modalFileTitle}>{title}.zip</Text>

            {/* Answer Input Card */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Answer</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Write your message here"
                placeholderTextColor="#94A3B8"
                multiline
                value={answer}
                onChangeText={setAnswer}
              />
            </View>

            <View style={{ flex: 1 }} />

            {/* Send Button */}
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.sendButtonText}>💬 Send Answer</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  orangeLine: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.secondary,
    lineHeight: 22,
    marginBottom: 25,
  },
  downloadCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: COLORS.grayDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  downloadText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  downloadIcon: {
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  deleteButton: {
    borderWidth: 1.5,
    borderColor: COLORS.red,
    backgroundColor: COLORS.lightRed,
  },
  deleteButtonText: {
    color: COLORS.red,
    fontWeight: '600',
    fontSize: 16,
  },
  answerButton: {
    backgroundColor: COLORS.primary,
  },
  answerButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.grayDark,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.lightBlue,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '100%',
  },
  dragHandle: {
    width: 38,
    height: 4,
    backgroundColor: COLORS.grayLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  closeHeader: {
    marginBottom: 20,
  },
  closeText: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  modalFileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 25,
  },
  inputCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    minHeight: 180,
    shadowColor: COLORS.grayDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  textInput: {
    fontSize: 16,
    color: COLORS.primary,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: COLORS.secondary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  sendButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
