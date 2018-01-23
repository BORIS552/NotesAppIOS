import React, { Component } from 'react';
import {Text, View, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, TextInput} from 'react-native';
import Swipeout from 'react-native-swipeout';
import { RaisedTextButton } from 'react-native-material-buttons';

export default class RemoteData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data:[],
			refreshing: false,
			editStatus: false,
			editTitle: '',
			editContent: '',
			edit_id:0,
			addState: false,
			addNoteTitle: '',
			addNoteContent: ''
		}
	}

	componentDidMount = () => {
		fetch('https://192.168.1.3:3000/notes', {
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);

			this.setState({
				data: responseJson
			});

			this.setState({
				refreshing: false
			});
		})
		.catch((error) => {
			console.log(error);
		});
	}

	alertContent = (d) => {
		alert(d.content);
	}

	deleteNote = (d) => {
		var id = d._id;
		var url = 'https://192.168.1.3:3000/notes/'+id;
		fetch(url,{
			method: 'DELETE'
		})
		.then((response) => response.json())
		.then((responseJson) =>{
			console.log(responseJson);
			if(responseJson.message == "Note deleted Successfully"){
				this.componentDidMount();
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}

	editNote = (d) => {
		this.setState({editStatus: true});
		this.setState({editTitle: d.title});
		this.setState({editContent: d.content});
		this.setState({edit_id: d._id});
	}

	_onRefresh(){
		this.setState({refreshing: true});
		this.componentDidMount();
	}

	SubmitEdit() {
		var id = this.state.edit_id;
		var editedTitle = this.state.editTitle;
		var editedContent = this.state.editContent;
		var url = 'https://192.168.1.3:3000/notes/'+id;
		fetch(url,{
			method: 'PUT',
			headers: new Headers({
				'content-type':'application/json',
			}),
			body:JSON.stringify({
				title: editedTitle,
				content: editedContent
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			this.componentDidMount();
		})
		.catch((error) => {
			console.log(error);
		})
		
		this.setState({editStatus: false});
	}

	CancelEdit(){
		this.setState({editStatus: false});
	}

	handleEditedTitle = (text) => {
		this.setState({editTitle: text});
	}
	handleEditedContent = (text) => {
		this.setState({editContent: text});
	}

	addNote() {
    	this.setState({addState: true});
  	}

  	CancelNote() {
    	this.setState({addState: false});
  	}

  	handleNoteTitle = (text) => {
  		this.setState({addNoteTitle: text});
  		console.log(this.state.addNoteTitle);
  	}
  	handleNoteContent = (text) => {	
  		this.setState({addNoteContent: text});
  		console.log(this.state.addNoteContent);
  	}

  	SubmiNote() {
  		console.log('Submit Clicked');
  		var var_title = this.state.addNoteTitle;
  		var var_content = this.state.addNoteContent;
  		fetch('https://192.168.1.3:3000/notes',{
			method: 'POST',
			headers: new Headers({
				'content-type':'application/json',
			}),
			body:JSON.stringify({
				title: var_title,
				content: var_content
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			this.componentDidMount();
		})
		.catch((error) => {
			console.log(error);
		})
		
		this.setState({addState: false});
  	}

	render(){
		return(
			<View>
			{this.state.editStatus ? 
				<View>
					<TextInput style = {styles.editTitleStyle}
					value = {this.state.editTitle}
					placeholderTextColor = "#9a73ef"
					onChangeText = {this.handleEditedTitle}/>

					<TextInput style = {styles.editContentStyle}
					multiline = {true}
					value = {this.state.editContent}
					placeholderTextColor = "#9a73ef"
					onChangeText = {this.handleEditedContent}/>

					<RaisedTextButton
					onPress = {() => this.SubmitEdit()}
					title='Edit'
					titleColor = "#ffffff"
					titleStyle = {styles.textHead}
					style = {styles.editSubmitStyle}
					/>	
					<RaisedTextButton
					onPress = {() => this.CancelEdit()}
					title='Cancel'
					titleColor = "#ffffff"
					titleStyle = {styles.textHead}
					style = {styles.editSubmitStyle}
					/>				
				</View>
				:
				<View>
				{this.state.addState ? 
					<View>
						<TextInput style = {styles.editTitleStyle}
						placeholderTextColor = "#9a73ef"
						onChangeText = {this.handleNoteTitle}/>

						<TextInput style = {styles.editContentStyle}
						multiline = {true}
						placeholderTextColor = "#9a73ef"
						onChangeText = {this.handleNoteContent}/>

						<RaisedTextButton
						onPress = {() => this.SubmiNote()}
						title='Submit'
						titleColor = "#ffffff"
						titleStyle = {styles.textHead}
						style = {styles.editSubmitStyle}
						/>	
						<RaisedTextButton
						onPress = {() => this.CancelNote()}
						title='Cancel'
						titleColor = "#ffffff"
						titleStyle = {styles.textHead}
						style = {styles.editSubmitStyle}
						/>				
					</View>
					:
					<View>
					<RaisedTextButton
          			onPress = {() => this.addNote()}
          			title='Add Note'
          			titleColor = "#ffffff"
          			titleStyle = {styles.textHead}
          			style = {styles.addNoteStyle}/>
					<ScrollView
					refreshControl={
						<RefreshControl
						refreshing = {this.state.refreshing}
						onRefresh={this._onRefresh.bind(this)}/>
					}>
					{
						this.state.data.map((d, index) => (
							<Swipeout 
							key = {d._id}
							style = {styles.swipeoutStyle}
							right={
							[
								{
									text: 'Delete',
									backgroundColor: 'red',
									onPress: () => {this.deleteNote(d)}
								}
							]
							}
							left={
							[
								{
									text: 'Edit',
									backgroundColor: '#40c4ff',
									onPress: () => { this.editNote(d) }
								}
							]
							}>
							<TouchableOpacity
								key = {d._id}
								style = {styles.container}
								onPress = {() => this.alertContent(d)}>
								<Text style = {styles.textHead}>
									{d.title}
								</Text>
								<Text style = {styles.text}>
									{d.content}
								</Text>
							</TouchableOpacity>
							</Swipeout>
						))
					}
					</ScrollView>
					</View>
					}
				</View>
			}	
			</View>
		)
	}
}

const styles = StyleSheet.create ({
	container: {
		padding: 15,
		backgroundColor: '#7b1fa2',
		alignItems: 'center'
	},
	textHead: {
		color: '#ffffff',
		fontWeight: 'bold',
		fontSize: 20
	},
	text: {
		color: '#ffffff'
	},
	swipeoutStyle: {
		borderRadius: 8,
		marginTop: 10
	},
	editTitleStyle: {
		padding: 10,
		marginTop: -200,
		height: 40,
		width: 300,
		borderColor: '#7a42f4',
		borderWidth: 2,
		borderRadius: 8
	},
	editContentStyle: {
		padding: 10,
		marginTop: 20,
		height: 200,
		width: 300,
		borderColor: '#7a42f4',
		borderWidth: 2,
		borderRadius: 8
	},
	editSubmitStyle: {
		padding:20,
		marginTop:20,
		backgroundColor:'red',
		height: 80,
		borderRadius: 8
	},
	addNoteStyle: {
    padding:20,
    backgroundColor:'black',
    borderRadius: 8
  	}	
});
