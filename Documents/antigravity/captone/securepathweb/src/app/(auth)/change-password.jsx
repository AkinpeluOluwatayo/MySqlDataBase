import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuthMutations } from '../../../src/modules/auth/services/useAuth';
import { useProfile } from '../../../src/modules/profile/services/useProfile';

export default function ChangePassword() {
    const router = useRouter();

    
    const { resetPassword } = useAuthMutations();
    const { profile } = useProfile();

    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    
    const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false });

    const handleUpdate = () => {
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Mismatch", "New password and confirmation do not match.");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Security", "Password should be at least 6 characters.");
            return;
        }

        
        
        resetPassword.mutate({
            currentPassword,
            newPassword
        }, {
            onSuccess: () => {
                Alert.alert("Success", "Your password has been updated successfully.", [
                    { text: "OK", onPress: () => router.back() }
                ]);
            },
            onError: (error) => {
                const errorMessage = error?.response?.data?.message || "Failed to update password. Please check your current password.";
                Alert.alert("Update Failed", errorMessage);
            }
        });
    };

    return (
        <View style={styles.container}>
            {}
            <View style={styles.backgroundOverlay}>
                <SafeAreaView>
                    <View style={styles.bgProfileInfo}>
                        <View style={styles.avatarSmall}>
                            <Ionicons name="person-outline" size={24} color="#27AE60" />
                        </View>
                        <View>
                            {}
                            <Text style={styles.bgName}>{profile?.fullName || 'User'}</Text>
                            <Text style={styles.bgEmail}>{profile?.email || 'SecurePath User'}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContent}
            >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>Change Password</Text>
                        <TouchableOpacity
                            style={styles.backCircle}
                            onPress={() => router.back()}
                            disabled={resetPassword.isPending}
                        >
                            <Ionicons name="arrow-back" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        {}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Current Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter current password"
                                    secureTextEntry={!showPass.current}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    editable={!resetPassword.isPending}
                                />
                                <TouchableOpacity onPress={() => setShowPass({...showPass, current: !showPass.current})}>
                                    <Ionicons name={showPass.current ? "eye-off" : "eye"} size={20} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter new password"
                                    secureTextEntry={!showPass.next}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    editable={!resetPassword.isPending}
                                />
                                <TouchableOpacity onPress={() => setShowPass({...showPass, next: !showPass.next})}>
                                    <Ionicons name={showPass.next ? "eye-off" : "eye"} size={20} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <View style={[
                                styles.inputWrapper,
                                newPassword !== confirmPassword && confirmPassword.length > 0 ? styles.errorBorder : null
                            ]}>
                                <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm new password"
                                    secureTextEntry={!showPass.confirm}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    editable={!resetPassword.isPending}
                                />
                                <TouchableOpacity onPress={() => setShowPass({...showPass, confirm: !showPass.confirm})}>
                                    <Ionicons name={showPass.confirm ? "eye-off" : "eye"} size={20} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>
                            {newPassword !== confirmPassword && confirmPassword.length > 0 && (
                                <Text style={styles.errorText}>Passwords do not match</Text>
                            )}
                        </View>

                        {}
                        <TouchableOpacity
                            style={[styles.updateBtn, resetPassword.isPending && { opacity: 0.7 }]}
                            onPress={handleUpdate}
                            disabled={resetPassword.isPending}
                        >
                            {resetPassword.isPending ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.updateText}>UPDATE PASSWORD</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#14532D' },
    backgroundOverlay: { paddingBottom: 100 },
    bgProfileInfo: { flexDirection: 'row', alignItems: 'center', padding: 25, opacity: 0.5 },
    avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    bgName: { color: '#fff', fontSize: 18, fontWeight: '700' },
    bgEmail: { color: '#fff', fontSize: 12 },
    modalContent: { flex: 1, justifyContent: 'flex-end' },
    card: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, height: '85%' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
    backCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
    form: { flex: 1 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', height: 60, borderRadius: 18, paddingHorizontal: 15, borderWidth: 1, borderColor: '#F1F5F9' },
    input: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '500' },
    updateBtn: { backgroundColor: '#2980B9', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    updateText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    errorBorder: { borderColor: '#EF4444' },
    errorText: { color: '#EF4444', fontSize: 12, marginTop: 5, fontWeight: '600' }
});