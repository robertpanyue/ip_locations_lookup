import React from 'react';
import './App.css';
import SearchPage from './SearchPage';
function App() {
	return (
		<div className="App">
			<header className="App-header">
				<p>IP(ipv4) Address Lookup</p>
			</header>
			<div className="content">
				<SearchPage />
			</div>
		</div>
	);
}

export default App;
