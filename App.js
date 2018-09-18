import React from 'react';
import { createStackNavigator } from 'react-navigation'
import AddClient from './screens/AddClient';
import ClientList from './screens/ClientList';

const AppNav = createStackNavigator({
	ClientList: { screen: ClientList },
	AddClient: { screen: AddClient },
});

export default class App extends React.Component {
	render() {
		return <AppNav />;
	}
}
