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
                isCentered={true}
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
                    width: 230,
                    margin: 0,
                    display: 'flex',
                    borderStyle: 'solid',
                    borderRightWidth: 2,
                },
                drawerItemStyle: {
                    borderRadius: 0,
                },
                drawerActiveBackgroundColor: Colors.dark.softHighlight, // Fondo para el item seleccionado (gris claro)
                drawerInactiveBackgroundColor: Colors.dark.background, // Fondo para el item no seleccionado (negro)
                drawerActiveTintColor: Colors.dark.background, // Color del texto del item seleccionado (negro para contraste con el gris claro)
                drawerInactiveTintColor: Colors.dark.text, // Color del texto del item no seleccionado (tu Color.dark.text, asumiendo que es un color claro para contraste con el fondo negro)


                drawerLabel: ({ focused }) => {
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
                            lineHeight: 30,
                            width: 230,
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
