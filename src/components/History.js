import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';

import { Table, Input, DatePicker, Select, Radio } from 'antd';
import moement from 'moment';
import moment from 'moment';
const InputGroup = Input.Group;
const { Search } = Input;

const { RangePicker } = DatePicker;

class History extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{
					title: 'IP Address',
					dataIndex: 'ip',
					key: 'ip'
				},
				{
					title: 'Country Name',
					dataIndex: 'country_name',
					key: 'country_name'
				},
				{
					title: 'State',
					dataIndex: 'state_prov',
					key: 'state_prov'
				},
				{
					title: 'District',
					dataIndex: 'district',
					key: 'district'
				},
				{
					title: 'City',
					dataIndex: 'city',
					key: 'city'
				},
				{
					title: 'ZipCode',
					dataIndex: 'zipcode',
					key: 'zipcode'
				},
				{
					title: 'latitude',
					dataIndex: 'latitude',
					key: 'latitude'
				},
				{
					title: 'longitude',
					dataIndex: 'longitude',
					key: 'longitude'
				},
				{
					title: 'Search Time (UTC Time)',
					dataIndex: 'TimeStamp',
					key: 'TimeStamp'
				}
			],
			data: [],
			isError: false,
			error: null,
			value: 1
		};
	}

	onChange = async (array) => {
		if (this.state.value === 1 && array[0] !== undefined && array[1] !== undefined) {
			var self = this;
			let start = array[0].utc().format().substring(0, 10);
			let end = array[1].utc().format().substring(0, 10);
			console.log(start);
			console.log(end);
			axios
				.get('http://localhost:3001/search/history' + '?start=' + start + '&&end=' + end)
				.then(function(response) {
					// handle success
					let array = response.data;
					for (var i = 0; i < array.length; i++) {
						var o = array[i];
						o.key = o._id;
					}
					self.setState({ isError: false, data: array });
				})
				.catch(function(error) {
					self.setState({ isError: true, error: error.message });
				});
		}
	};

	onChangeSelect = (e) => {
		console.log('radio checked', e.target.value);
		this.setState({
			value: e.target.value
		});
	};

	search = async (value) => {
		if (this.state.value === 2) {
			var self = this;
			axios
				.get('http://localhost:3001/search/history' + '?last=' + value)
				.then(function(response) {
					// handle success
					let array = response.data;
					for (var i = 0; i < array.length; i++) {
						var o = array[i];
						o.key = o._id;
						o.TimeStamp = o.TimeStamp.substring(0, o.TimeStamp.length - 5);
					}
					console.log('search N', array);
					self.setState({ isError: false, data: array });
				})
				.catch(function(error) {
					self.setState({ isError: true, error: error.message });
				});
		}
	};

	render() {
		const radioStyle = {
			display: 'block',
			height: '30px',
			lineHeight: '30px',
			marginTop: '10px'
		};
		return (
			<div>
				<div className="filter">
					<InputGroup compact>
						<Radio.Group onChange={this.onChangeSelect} value={this.state.value}>
							<br />

							<Radio style={radioStyle} value={1}>
								Get the Search History in Date Range
							</Radio>
							<RangePicker format="YYYY-MM-DD" onCalendarChange={(array) => this.onChange(array)} />
							<br />

							<Radio style={radioStyle} value={2}>
								Get Most Number of Recent History
							</Radio>
							<Search
								placeholder="Number of History"
								enterButton="Search"
								onSearch={(value) => this.search(value)}
							/>
						</Radio.Group>
					</InputGroup>
				</div>

				{this.state.isError && <p>{this.state.error}</p>}
				<Table columns={this.state.columns} dataSource={this.state.data} />
			</div>
		);
	}
}

export default History;
