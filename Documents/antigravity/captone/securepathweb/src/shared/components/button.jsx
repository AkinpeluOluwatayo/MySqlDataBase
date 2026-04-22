import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress, style, textStyle, color = '#27AE60' }) {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color }, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 65,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        width: '100%',
    },
    text: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
});