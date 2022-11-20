import Colors from './Colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    title: {
        color: Colors.dark,
        paddingTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    header: {
        color: Colors.dark,
        paddingTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
    subHeader: {
        color: Colors.dark,
        fontSize: 10,
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginTop: 3,
    },
});