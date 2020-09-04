import * as React from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { connect } from 'react-redux';
import Flau from './Flau';
import './Home.css';
import { Input } from 'reactstrap';


const Home = () => (
  <main>
    <Input type="text" className="form-control" />
    <Flau />
  </main>
);

/*
class ActionPanel extends React.Component {
  constructor(props){
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }
  escFunction(event){
    if(event.keyCode === 27) {
      //Do whatever when esc is pressed
    }
  }
  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);
  }
  render(){
    return (   
      <input/>
    )
  }
}
*/
export default connect()(Home);
