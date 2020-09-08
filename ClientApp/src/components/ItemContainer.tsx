import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import * as ItemsStore from '../store/Item';
import * as StagesStore from '../store/Stages';
import './Item.css';
import ChildItemContainer from './ChildItemContainer';

// At runtime, Redux will merge together...
type ItemProps =
  { parent: string }
  & ItemsStore.ItemsState // ... state we've requested from the Redux store
  & StagesStore.Stages
  & typeof ItemsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ id: string }>; // ... plus incoming routing parameters


class ItemContainer extends React.PureComponent<ItemProps> {

  private inputRef: React.RefObject<HTMLInputElement>;
  private parent: string;


  constructor(props: ItemProps) {
    super(props);

    this.parent = props.parent;
    console.log(this.parent);

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

  public render() {
    return (
      <React.Fragment>
        {this.renderBreadCrumbs()}
        <h1 id="tabelLabel">{this.parent === undefined || this.parent === "" ? "home" : this.parent.toString()}</h1>
        {this.renderItems()}
      </React.Fragment>
    );
  }

  private selectIcon = (stageId: number): any => {
    var stage = this.props.stages.find(s => s.id === stageId);

    if (stage) {
      return stage.icon;
    }

    return "circle";
  }


  private ensureDataFetched() {
    this.parent = (this.props.parent !== undefined && this.props.parent !== "") ? this.props.parent : (this.props.match.params.id || "");
    this.props.requestItems(this.parent);
  }

  /* FIXME: Need to set current item as active */
  private renderBreadCrumbs() {
    return (<Breadcrumb>{this.getBreadCrumb(this.parent).map(c =>
      <BreadcrumbItem key={c}><Link to={`/${c === "home" ? "" : c}`}>{c}</Link></BreadcrumbItem>
    )}</Breadcrumb>);

  }

  private getBreadCrumb(id: string | undefined): string[] {
    if (id === undefined || id === "home" || id === "") {
      return ["home"];
    }
    else {
      var item = this.props.items.find(i => i.id === id);

      if (item) {
        return this.getBreadCrumb(item.parentId).concat([item.id]);
      }
    }

    return ["Not found"];
  }

  private keypress(e: any): void {

    if (e.key === 'Enter') {
      if (!this.props.selectedId)
        return;
      if (!this.inputRef.current)
        return;
      var start = this.inputRef.current.selectionStart ? this.inputRef.current.selectionStart : 0;
      var end = this.inputRef.current.selectionEnd ? this.inputRef.current.selectionEnd : 0;
      this.props.split(this.props.selectedId, start, end);
    }
  }

  private renderItems() {
    return (
      <section>
        {this.props.items.filter(i => i.parentId === this.parent).map((item: ItemsStore.Item) => (
          <div key={item.id}>
            <div onClick={() => { this.props.select(item.id) }} className={`item ${this.props.selectedId === item.id ? "selected" : ""}`}>
              <span className={`indicator ${this.selectIcon(item.stage)}`}></span>
              {(() => {
                if (this.props.selectedId === item.id) {
                  return <input type="text" ref={this.inputRef} autoFocus className="itemDesc" onKeyPress={(e) => this.keypress(e)} defaultValue={item.summary} />
                }
                else {
                  return <span className="itemDesc" onKeyPress={(e) => this.keypress(e)} contentEditable={this.props.selectedId === item.id ? true : false} suppressContentEditableWarning={true}>{item.summary}</span>;
                }
              })()}

              <Link className="handle open" to={`/${item.id}`} />

            </div>

            {(() => {
              const p = {
                ...this.props,
                level: 1,
                parent: item.id
              }
              return (<ChildItemContainer {...p} />)
            })()}

          </div>
        ))}
      </section>
    );
  }
}

export default connect(
  (state: ApplicationState) =>
    ({
      items: state.item ? state.item.items : [],
      isLoading: state.item ? state.item.isLoading : false,
      parentId: state.item ? state.item.parentId : undefined,
      selectedId: state.item ? state.item.selectedId : undefined,
      stages: state.stages ? state.stages.stages : []
    }), // Selects which state properties are merged into the component's props
  ItemsStore.actionCreators // Selects which action creators are merged into the component's props
)(ItemContainer as any);