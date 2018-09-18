import React from 'react';
import { FlatList, StyleSheet, Text, View, AsyncStorage, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Avatar } from 'react-native-elements';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 0
	},
	heading: {
		fontSize: 25,
		padding: 10,
		height: 40,
		width: '100%',
		borderBottomWidth: 1,
		borderColor: '#000',
		color: '#000'
	},
	flat: {
		width: '100%',
		padding: 10
	},
	avatar: {
		marginTop: 20,
		paddingTop: 10,
		color: '#000'
	},
	item: {
		color: '#000',
		alignItems: 'flex-start',
		padding: 10,
		fontSize: 18,
		height: 44,
		textAlignVertical: 'center',
		backgroundColor: '#3dcca5',
		borderColor: '#000',
		borderWidth: 1,
		margin: 5
	},
	actionBtn: {
		borderWidth:1,
		borderColor:'rgba(0,0,0,0.4)',
		alignItems:'center',
		justifyContent:'center',
		width:70,
		position: 'absolute',
		bottom: 10,
		right: 10,
		height:70,
		backgroundColor:'#fff',
		borderRadius:100
	}
});

export default class ClientList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clientArr: [],
			refreshing: true
		};
		this.updateList();
		this.syncFunc = this.syncFunc.bind(this);
	}
	updateList() {
		let storageObj = {};
		let retrieveData = async () => {
			try {
				return await AsyncStorage.getItem('Clients');
			} catch (error) {
				console.error(error);
			}
		};
		retrieveData().then(
			(data) => {
				let tempArr = [];
				storageObj = JSON.parse(data || "{}");
				let inc = 0;
				for (let key in storageObj) {
					if (storageObj.hasOwnProperty(key)) {
						storageObj[key].key = 'a' + inc++;
						tempArr.push(storageObj[key])
					}
				}
				this.state.clientArr = tempArr;
				this.state.refreshing = false;
				this.setState(this.state);
			});
	}
	syncFunc() {
		this.updateList();
	};
	render () {
		const { navigate } = this.props.navigation;
		return (
			<View style={styles.container}>
				<Text/>
				<Text style={styles.heading}>Here are the list of clients:</Text>
				<Text/>
				<FlatList
					data={this.state.clientArr}
					style={styles.flat}
					renderItem={({item}) =>
						<Text style={styles.item}>
							<Avatar
								size="small"
								rounded
								containerStyle={{
									marginTop: 20,
									paddingTop: 10
								}}
								title={item.name.substr(0, 2)}
								activeOpacity={0.7}
							/>
							<Text>
								{item.name || ''}
							</Text>
						</Text>
						}
				/>
				<TouchableOpacity
					style={styles.actionBtn}
					onPress={() =>
						navigate('AddClient', {syncFunc: this.syncFunc})
					}
				>
					<Icon name="plus"  size={30} color="#000000" />
				</TouchableOpacity>
			</View>
		);
	}
}