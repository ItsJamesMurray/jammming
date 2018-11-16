import React from 'react';

class Track extends React.Component{
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  addTrack(){
    this.props.onAdd(this.props.track);
  }

  onRemove(){
    this.props.onRemove(this.props.track);
  }

  renderAction(){
    if(this.props.isRemoval){
      return <a onClick = {this.onRemove}>-</a>
    } else {
      return <a onClick = {this.addTrack}>+</a>
    }
  }
  render(){
    return(
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.name}</h3>
          <p>{this.props.artist} | {this.props.album}</p>
        </div>
        <a className="Track-action">{this.renderAction}</a>
      </div>
  )}
}

export default Track;
