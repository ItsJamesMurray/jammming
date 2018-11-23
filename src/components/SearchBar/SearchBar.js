import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  search(term){
    this.props.onSearch(term);
  }

  handleTermChange(event){
    this.search(event.target.value);
  }

  handleEnter(event) {
  	if (event.keyCode === 13) {
  		this.search(event.target.value);
  	}
  }

  render(){
    return(
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
               onChange = {this.handleTermChange}
               onKeyDown = {this.handleEnter}
        />
        <a>SEARCH</a>
      </div>
    )
  }
}

export default SearchBar;
