import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { TragosList } from '@/components/TragosList';
import { Colors } from '@/constants/Colors';
import { Drink } from '@/types/drinks';

interface Props {
    category: string;
    drinkslist: Drink[];
    selectedList: number[];
    updateSelectedList: (list: number[]) => void;
    getButtonLabel: (category: string, selectAll: boolean) => string;
    handleToggleCategory: (category: string, selectAll: boolean) => void;
}

export default function CategorySection({
    category,
    drinkslist,
    selectedList,
    updateSelectedList,
    getButtonLabel,
    handleToggleCategory
}: Props) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Pressable
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
            style={[styles.categorySection, isHovered && styles.categoryHover]}
        >
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category.toUpperCase()}</Text>
                <View style={styles.categoryButtons}>
                    <Pressable
                        style={({ hovered }) => [styles.buttonWrapper, hovered && styles.buttonHoverEffect]}
                    >
                        <Button
                            title={getButtonLabel(category.toLowerCase(), true)}
                            variant='secondary'
                            size='big'
                            onPress={() => handleToggleCategory(category, true)}
                        />
                    </Pressable>
                    <Pressable
                        style={({ hovered }) => [styles.buttonWrapper, hovered && styles.buttonHoverEffect]}
                    >
                        <Button
                            title={getButtonLabel(category.toLowerCase(), false)}
                            variant='secondary'
                            size='big'
                            onPress={() => handleToggleCategory(category, false)}
                        />
                    </Pressable>
                </View>
            </View>
            <TragosList
                selectedList={selectedList}
                setSelected={updateSelectedList}
                list={drinkslist.filter((item: Drink) => item.categoria === category)}
                title=""
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    categorySection: {
        paddingVertical: 10,
    },
    categoryHover: {
        backgroundColor: '#181818',
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 60,
        marginTop: 20,
    },
    categoryTitle: {
        color: Colors.dark.text,
        fontWeight: 'bold',
        fontSize: 18,
    },
    categoryButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    buttonWrapper: {
        borderRadius: 4,
    },
    buttonHoverEffect: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
    },
});
