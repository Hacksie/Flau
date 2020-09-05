import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as FlauStore from '../store/Flau';
import * as StagesStore from '../store/Stages';
import { Row, Col } from 'reactstrap';
import './Flau.css';


type FlauProps =
    FlauStore.Flau &
    StagesStore.Stages &
    typeof FlauStore.actionCreators &
    RouteComponentProps<{ id:string }>;

class Flau extends React.PureComponent<FlauProps> {

    private inputRef: React.RefObject<HTMLInputElement>;

    constructor(props: any) {
        super(props);

        this.inputRef = React.createRef();
    }

  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    this.ensureDataFetched();
  }

  private ensureDataFetched() {
    const rootId = parseInt(this.props.match.params.id, 10) || 0;
    console.log(rootId);
    //this.props.requestWeatherForecasts(startDateIndex);
  }  

    private keypress(e: any): void {

        if (e.key === 'Enter') {
            if (this.inputRef.current) {
                var start = this.inputRef.current.selectionStart ? this.inputRef.current.selectionStart : 0;
                var end = this.inputRef.current.selectionEnd ? this.inputRef.current.selectionEnd : 0;
                this.props.split(this.props.selectedId, start, end);
            }
        }
    }

    private selectIcon = (stageId:number):any => {
        var stage = this.props.stages.find(s => s.id === stageId);

        if(stage)
        {
            return stage.icon;
        }

        return "circle";
    }


    public render() {


        return (
            <React.Fragment>
                <span> {console.log(this.props)}</span>
                <Row>
                    <Col className="p-2 stage">
                        <h1>Desc</h1>
                        <span>{}</span>
                        {/* createRef to focus element */}
                        
                        {this.props.items.map((item) => (
                            <div key={item.id} onClick={() => { this.props.select(item.id) }} className={`item ${this.props.selectedId === item.id ? "selected" : ""}`}>

                                <span className={`indicator ${this.selectIcon(item.stageId)}`} onClick={() => this.props.next(item.id)}></span>
                                {(() => {
                                    if (this.props.selectedId === item.id) {
                                        return <input type="text" ref={this.inputRef} autoFocus className="itemDesc" onKeyPress={(e) => this.keypress(e)} defaultValue={item.summary} />
                                    }
                                    else {
                                        return <span className="itemDesc" onKeyPress={(e) => this.keypress(e)} contentEditable={this.props.selectedId === item.id ? true : false} suppressContentEditableWarning={true}>{item.summary}</span>;
                                    }
                                })()}



                                {/*
                                <span
                                    className={`prev ${(this.props.selectedId === item.id && item.stageId !== 0) ? "" : "hidden"}`}
                                    onClick={() => { this.props.prev(item.id); }}></span>
                                */}
                            </div>
                        ))}

                    </Col>


                </Row>
            </React.Fragment >
        )
    }
};

export default connect(
    (state: ApplicationState) => ({
        root : state.currentRoot,
        selectedId: state.flau ? state.flau.selectedId : 0,
        items: state.flau ? state.flau.items : [],
        stages: state.stages ? state.stages.stages : []
    }), FlauStore.actionCreators, // Selects which state properties are merged into the component's props

)(Flau as any);
