import { View, TouchableOpacity, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TragosListItem } from '@/components/TragosListItem';
import { ScrollView } from 'react-native-gesture-handler';

type Drink = {
    id: number,
    title: string,
    image: string,
}
interface ListProps {
    title: string;
    selectedList: Drink[];
    setSelected: any,
    list: Drink[],
}
export const TragosList = ({
    title,
    selectedList,
    setSelected,
    list,
}: ListProps) => {
    const addItemToSelected = (item: Drink) => {
        const exists = selectedList.some(drink => drink.id === item.id);
        if (!exists) {
            const newSelected = [...selectedList, item];
            setSelected(newSelected);
        } else {
            const newSelected = selectedList.filter(drink => drink.id !== item.id);
            setSelected(newSelected);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>
            <ScrollView horizontal style={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    {list.map((item, index) => (
                        <TouchableOpacity onPress={() => addItemToSelected(item)}>
                            <TragosListItem
                                key={index}
                                title={item.title}
                                selected={selectedList.some(drink => drink.id == item.id)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 300,
        marginInline: 'auto',
    },
    title: {
        height: 55,
        fontSize: 20,
        color: Colors.dark.text,
        textTransform: 'uppercase',
        paddingLeft: 18,
        lineHeight: 55,
        borderColor: Colors.dark.text,
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    scrollContainer: {
        paddingInline: 40,
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
    }
});
