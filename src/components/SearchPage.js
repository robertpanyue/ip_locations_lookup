import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Input, Tabs, Descriptions } from 'antd';
import History from './History';
// import GoogleMap from './GoogleMap';
const { TabPane } = Tabs;
const { Search } = Input;

class SearchPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isSearch: false,
			isError: false,
			error: null,
			result: null
		};
	}

	componentDidMount() {}

	callback = (key) => {
		// if (key == 2) {
		// 	var self = this;
		// 	axios
		// 		.post('http://localhost:3001/search/', { ip: value })
		// 		.then(function(response) {
		// 			// handle success
		// 			self.setState({ isError: false, isSearch: true, result: response.data.data });
		// 		})
		// 		.catch(function(error) {
		// 			self.setState({ isSearch: false, isError: true, error: error.message });
		// 		});
		// }
	};

	search = (value) => {
		var self = this;
		axios
			.post('http://localhost:3001/search/', { ip: value })
			.then(function(response) {
				// handle success
				self.setState({ isError: false, isSearch: true, result: response.data.data });
			})
			.catch(function(error) {
				self.setState({ isSearch: false, isError: true, error: error.message });
			});
	};

	render() {
		const { isSearch, isError, result, error } = this.state;
		return (
			<Tabs defaultActiveKey="1" onChange={this.callback}>
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
					result != null && (
						<Descriptions title="IP Info" bordered>
							<Descriptions.Item label="IP Address">{this.state.result.ip}</Descriptions.Item>
							<Descriptions.Item label="Country Name">{this.state.result.country_name}</Descriptions.Item>
							<Descriptions.Item label="State">{this.state.result.state_prov}</Descriptions.Item>
							<Descriptions.Item label="District">{this.state.result.district}</Descriptions.Item>

							<Descriptions.Item label="City">{this.state.result.city}</Descriptions.Item>
							<Descriptions.Item label="ZipCode">{this.state.result.zipcode}</Descriptions.Item>
							<Descriptions.Item label="latitude">{this.state.result.latitude}</Descriptions.Item>
							<Descriptions.Item label="longitude">{this.state.result.longitude}</Descriptions.Item>
							<Descriptions.Item label="Current Time of IP">
								{`${this.state.result.time_zone.current_time}`.substring(0, 19)}
							</Descriptions.Item>
						</Descriptions>
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
