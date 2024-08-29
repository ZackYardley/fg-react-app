// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import functions from '@react-native-firebase/functions';
// import messaging from '@react-native-firebase/messaging';

// const AdminNotificationScreen = () => {
//     const [notificationType, setNotificationType] = useState('promotional');
//     const [title, setTitle] = useState('');
//     const [body, setBody] = useState('');
//     const [topic, setTopic] = useState('all_users');

//     const sendNotification = async () => {
//         try {
//             const sendNotificationFunction = functions().httpsCallable('sendNotification');
//             const result = await sendNotificationFunction({
//                 topic: topic,
//                 notificationType: notificationType,
//                 title: title,
//                 body: body,
//             });

//             if ((result.data as { success: boolean }).success) {
//                 Alert.alert('Success', 'Notification sent successfully!');
//             } else {
//                 Alert.alert('Error', 'Failed to send notification');
//             }
//         } catch (error) {
//             console.error('Error sending notification:', error);
//             Alert.alert('Error', 'An error occurred while sending the notification');
//         }
//     };

//     const testBackgroundNotification = async () => {
//         try {
//             const token = await messaging().getToken();
//             const sendNotificationFunction = functions().httpsCallable('sendNotification');
//             await sendNotificationFunction({
//                 token: token,
//                 notificationType: 'test',
//                 title: 'Background Test',
//                 body: 'This is a test background notification',
//             });
//             Alert.alert('Test Sent', 'Check your device for a background notification');
//         } catch (error) {
//             console.error('Error sending test notification:', error);
//             Alert.alert('Error', 'Failed to send test notification');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Send Notification</Text>

//             <Picker
//                 selectedValue={notificationType}
//                 onValueChange={(itemValue) => setNotificationType(itemValue)}
//                 style={styles.picker}
//             >
//                 <Picker.Item label="Promotional" value="promotional" />
//                 <Picker.Item label="Update" value="update" />
//                 <Picker.Item label="New Message" value="new_message" />
//             </Picker>

//             <Picker
//                 selectedValue={topic}
//                 onValueChange={(itemValue) => setTopic(itemValue)}
//                 style={styles.picker}
//             >
//                 <Picker.Item label="All Users" value="all_users" />
//                 <Picker.Item label="Premium Users" value="premium_users" />
//                 <Picker.Item label="New Users" value="new_users" />
//             </Picker>

//             <TextInput
//                 style={styles.input}
//                 placeholder="Notification Title"
//                 value={title}
//                 onChangeText={setTitle}
//             />

//             <TextInput
//                 style={[styles.input, styles.bodyInput]}
//                 placeholder="Notification Body"
//                 value={body}
//                 onChangeText={setBody}
//                 multiline
//             />

//             <TouchableOpacity style={styles.button} onPress={sendNotification}>
//                 <Text style={styles.buttonText}>Send Notification</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={testBackgroundNotification}>
//                 <Text style={styles.buttonText}>Test Background Notification</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#fff',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     picker: {
//         height: 50,
//         marginBottom: 20,
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 20,
//         paddingHorizontal: 10,
//     },
//     bodyInput: {
//         height: 100,
//         textAlignVertical: 'top',
//     },
//     button: {
//         backgroundColor: '#409858',
//         padding: 15,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default AdminNotificationScreen;