import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage } from 'react-native';
import Button from 'react-native-elements/src/buttons/Button';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
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
	formGroup: {
		padding: 10,
		marginTop: 10
	},
	textInput: {
		width: '100%',
		height: 20,
		margin: 5,
		alignItems: 'center'
	},
	error: {
		color: '#98000e',
		fontSize: 10
	}
});

export default class AddClient extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				name: '',
				email: '',
				mobile: '',
				whatsappNo: ''
			},
			validInput: {
				name: {
					text: '',
					isValid: false
				},
				email: {
					text: '',
					isValid: false
				},
				mobile: {
					text: '',
					isValid: false
				},
				whatsappNo: {
					text: '',
					isValid: false
				}
			},
			isValidForm: false
		};
		this.onInputChange = this.onInputChange.bind(this);
		this.submitBtnClicked = this.submitBtnClicked.bind(this);
		this.fetchData = this.fetchData.bind(this);
	}
	formValidation() {
		for (let key in this.state.formData) {
			if (key === 'mobile' || key === 'whatsappNo') {
				if (this.state.formData[key] && this.state.formData[key].length === 10) {
					this.state.validInput[key].isValid = true;
					this.state.validInput[key].text = '';
					if (key === 'mobile' && this.state.formData.mobile.length === 10) {
						this.state.formData.whatsappNo = this.state.formData.mobile;
					}
				} else {
					this.state.validInput[key].isValid = false;
					this.state.validInput[key].text = this.state.formData[key] ? '(Please enter 10 digit number)' : '';
				}
			}
			if (key === 'name') {
				if (this.state.formData[key] && typeof this.state.formData[key] === 'string') {
					this.state.validInput[key].isValid = true;
					this.state.validInput[key].text = '';
				} else {
					this.state.validInput[key].isValid = false;
					this.state.validInput[key].text = "(Please don't leave it empty)";
				}
			}
			if (key === 'email') {
				if (this.state.formData[key] && typeof this.state.formData[key] === 'string' && this.state.formData[key].indexOf('@') !== -1) {
					this.state.validInput[key].isValid = true;
					this.state.validInput[key].text = '';
				} else {
					this.state.validInput[key].isValid = false;
					this.state.validInput[key].text = this.state.formData[key] ? '(Please enter a valid email id)' : '';
				}
			}
		}
		this.state.isValidForm = this.state.validInput.name.isValid && this.state.validInput.mobile.isValid && this.state.validInput.whatsappNo.isValid && this.state.validInput.email.isValid;
	}
	onInputChange (key, val) {
		this.state.formData[key] = val;
		this.formValidation();
		this.setState(this.state);
	}

	submitBtnClicked() {
		let getData = async () => {
			try {
				return await AsyncStorage.getItem('Clients');
			} catch (error) {
				alert(error);
			}
		};
		getData().then(
			(data) => {
				if (data) {
					let objToStore = JSON.parse(data);
					let setData = async () => {
						try {
							objToStore[this.state.formData.email] = {
								name: this.state.formData.name,
								email: this.state.formData.email,
								mobile: this.state.formData.mobile,
								whatsappNo: this.state.formData.whatsappNo
							};
							await AsyncStorage.setItem('Clients', JSON.stringify(objToStore));
							return "Success";
						} catch (error) {
							alert(error);
						}
					};
					setData().then(
						(data) => {
							alert(data);
							this.state.formData = {
								name: '',
								email: '',
								mobile: '',
								whatsappNo: ''
							};
							this.formValidation();
							this.setState(this.state);
						});
				}
			});
	}

	fetchData() {
		let getData = async () => {
			try {
				const value = await AsyncStorage.getItem('Clients');
				return value ? value : "No data found";
			} catch (error) {
				alert(error);
			}
		};
		getData().then(
			(data) => {
				alert(data);
			});
	}
	render () {
		return (
			<View style={styles.container}>
				<Text style={styles.heading}>Add client details</Text>
				<View style={styles.formGroup}>
					<Text>Name</Text> <Text style={styles.error}>{this.state.validInput.name.text}</Text>
					<TextInput style={styles.textInput} value={this.state.formData.name} name="name" placeholder="Please enter name" onChangeText={(val) => this.onInputChange('name', val)} required/>

					<Text>Email</Text> <Text style={styles.error}>{this.state.validInput.email.text}</Text>
					<TextInput style={styles.textInput} value={this.state.formData.email} keyboardType="email-address" name="email" placeholder="Please enter email" onChangeText={(val) => this.onInputChange('email', val)} required/>

					<Text>Mobile No.</Text> <Text style={styles.error}>{this.state.validInput.mobile.text}</Text>
					<TextInput style={styles.textInput} maxLength={10} value={this.state.formData.mobile} keyboardType="phone-pad" name="mobile" placeholder="Please enter mobile number" onChangeText={(val) => this.onInputChange('mobile', val)} required/>

					<Text>WhatsApp No.</Text> <Text style={styles.error}>{this.state.validInput.whatsappNo.text}</Text>
					<TextInput style={styles.textInput} maxLength={10} value={this.state.formData.whatsappNo} keyboardType="phone-pad" name="whatsappNo" placeholder="Please enter whatsapp number" onChangeText={(val) => this.onInputChange('whatsappNo', val)} required/>
				</View>
				<Text/>
				<Button disabled={!this.state.isValidForm} onPress={this.submitBtnClicked} title="Submit"/>
				<Text/>
				<Button onPress={() => {this.props.navigation.goBack(); this.props.navigation.state.params.syncFunc()}} title="Go Back"/>
			</View>
		);
	}
}