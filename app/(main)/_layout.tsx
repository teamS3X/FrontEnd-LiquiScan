import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { withLayoutContext, useNavigation, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { clearSession, getSession } from '@/utils/session';

const { Navigator } = createDrawerNavigator();
const Drawer = withLayoutContext(Navigator);

const handleLogout = async () => {
    await clearSession();
    router.replace('/');
}
function CustomDrawerContent(props: any) {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <DrawerItemList {...props} />
            <View style={{ flex: 1 }} />
            <Button
                title='salir'
                onPress={handleLogout}
                variant='secondary'
                size='default'
            />
        </DrawerContentScrollView>
    );
}

export default function MainLayout() {
    const navigation = useNavigation();
    const [checking, setChecking] = useState(false);
    useEffect(() => {
        const checkSession = async () => {
            const { token, role } = await getSession();
            if (!token || role !== 'admin') {
                router.replace('/');
            }
            else {
                setChecking(false);
            }
        }
        checkSession();
    }, []);
    useEffect(() => {
        // Abrir o cerrar el drawer
    }, [navigation]);
    if (checking) {
        return (
            <View>
                <Text> Cargando...</Text>
            </View>
        )
    }
    return (
        <Drawer
            screenOptions={({ route }) => ({
                drawerType: 'permanent',
                swipeEnabled: false,
                headerShown: false,
                drawerStyle: {
                    backgroundColor: Colors.dark.background,
                    width: 200,
                    margin: 0,
                    display: 'flex',
                    borderStyle: 'solid',
                    borderRightWidth: 2,
                },
                drawerItemStyle: {
                    borderRadius: 0,
                },
                drawerActiveTintColor: Colors.dark.softHighlight,
                drawerActiveBackgroundColor: Colors.dark.softHighlight,
                drawerInactiveTintColor: Colors.dark.softHighlight,

                drawerLabel: () => {
                    const title: Record<string, string> = {
                        lists: 'Listas',
                        bars: 'Barras',
                        staff: 'Personal',
                        reports: 'Reportes',
                    }
                    return (
                        <Text style={{
                            color: Colors.dark.text,
                            fontSize: 16,
                            textTransform: 'uppercase',
                            height: 30,
                            lineHeight: 30,
                        }}>
                            {title[route.name] ?? route.name}
                        </Text>
                    )
                },
            })}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
        </Drawer>
    );
}
