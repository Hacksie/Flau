import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export default class NavMenu extends React.PureComponent<{}, { isOpen: boolean }> {
    public state = {
        isOpen: false
    };

    public render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm bg-light navbar-toggleable-sm border-bottom box-shadow mb-3" light>
                    <NavbarBrand tag={Link} to="/"><img id="logo" src="img/logo.svg" alt="Flau" /></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/"><img className="accountIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/home-outline.svg" /></NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/counter"><img className="accountIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/person-circle-outline.svg" /></NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/counter"><img className="accountIcon" src="https://unpkg.com/ionicons@5.1.2/dist/svg/log-out-outline.svg " /></NavLink>
                            </NavItem>
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}
