import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Input, Tabs, Descriptions, Button, Modal, Form } from 'antd';
import History from './History';
import GoogleMapComponent from './GoogleMapComponent';
const { TabPane } = Tabs;
const { Search } = Input;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
	class extends React.Component {
		render() {
			const { visible, onCancel, onCreate, form } = this.props;
			const { getFieldDecorator } = form;
			return (
				<Modal
					visible={visible}
					title="Send The IP info to Your Phone"
					okText="Send"
					onCancel={onCancel}
					onOk={onCreate}
				>
					<Form layout="vertical">
						<Form.Item label="Phone Number">
							<span>+1</span>
							{getFieldDecorator('title', {
								rules: [ { required: true, message: 'Please enter your phone number!' } ]
							})(<Input />)}
						</Form.Item>
					</Form>
				</Modal>
			);
		}
	}
);

class SearchPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isSearch: false,
			isError: false,
			error: null,
			info: null,
			showMap: false,
			data: null,
			visible: false,
			confirmLoading: false
		};
	}

	search = (value) => {
		if (value) {
			var self = this;
			axios
				.post('http://localhost:3001/search/', { ip: value })
				.then(function(response) {
					// handle success
					self.setState({
						isError: false,
						isSearch: true,
						info: response.data.data,
						showMap: true,
						data: { latitude: response.data.data.latitude, longitude: response.data.data.longitude }
					});
				})
				.catch(function(error) {
					self.setState({
						isSearch: false,
						isError: true,
						error: error.message,
						showMap: false,
						data: null,
						info: null
					});
				});
		}
	};

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleCancel = () => {
		console.log('Clicked cancel button');
		this.setState({
			visible: false
		});
	};

	handleCreate = () => {
		this.setState({
			confirmLoading: true
		});

		const { form } = this.formRef.props;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}

			console.log('Received values of form: ', values);

			fetch('http://localhost:3001/twilio', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ phone: values.title, data: this.state.info })
			})
				.then(function(response) {
					return response.json();
				})
				.then((data) => {
					if (data.error) {
						alert(data.error.message);
					}
					console.log(data);
					form.resetFields();
					this.setState({
						visible: false,
						confirmLoading: false
					});
				})
				.catch((error) => {
					form.resetFields();
					alert(error);
				});
		});
	};

	render() {
		const { isSearch, isError, info, error, showMap } = this.state;
		return (
			<Tabs defaultActiveKey="1">
				<TabPane tab="Search" key="1">
					<div className="SearchBar">
						<Search
							placeholder="IP Address"
							onSearch={(value) => this.search(value)}
							enterButton
							type="text"
							minLength={7}
							maxLength={15}
							pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
							required
						/>
					</div>
					{isError && error != null && <p>{this.state.error}</p>}
					{isSearch &&
					info != null && (
						<Descriptions title="IP Info" bordered>
							<Descriptions.Item label="IP Address">{this.state.info.ip}</Descriptions.Item>
							<Descriptions.Item label="Country Name">{this.state.info.country_name}</Descriptions.Item>
							<Descriptions.Item label="State">{this.state.info.state_prov}</Descriptions.Item>
							<Descriptions.Item label="District">{this.state.info.district}</Descriptions.Item>

							<Descriptions.Item label="City">{this.state.info.city}</Descriptions.Item>
							<Descriptions.Item label="ZipCode">{this.state.info.zipcode}</Descriptions.Item>
							<Descriptions.Item label="latitude">{this.state.info.latitude}</Descriptions.Item>
							<Descriptions.Item label="longitude">{this.state.info.longitude}</Descriptions.Item>
							<Descriptions.Item label="Current Time of IP">
								{`${this.state.info.time_zone.current_time}`.substring(0, 19)}
							</Descriptions.Item>
						</Descriptions>
					)}
					{showMap && (
						<div>
							<GoogleMapComponent data={this.state.data} />
							<Button
								type="primary"
								className="submit"
								style={{ height: '4em', width: '15em', marginTop: '1em' }}
								onClick={this.showModal}
							>
								Send The Route to Your Phone
							</Button>
							<CollectionCreateForm
								wrappedComponentRef={this.saveFormRef}
								visible={this.state.visible}
								onCancel={this.handleCancel}
								onCreate={this.handleCreate}
							/>
						</div>
					)}
				</TabPane>
				<TabPane tab="History" key="2">
					<History />
				</TabPane>
			</Tabs>
		);
	}
}

export default SearchPage;
