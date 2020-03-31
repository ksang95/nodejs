import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Search } from 'components';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: false
        };

        this.toggleSearch = this.toggleSearch.bind(this);
    }

    toggleSearch() {
        this.setState({
            search: !this.state.search
        });
    }

    render() {
        const loginButton = (
            <li>
                <Link to="/login">
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        );

        const logoutButton = (
            <li>
                <a onClick={this.props.onLogout}>
                    <i className="material-icons">lock_open</i>
                </a>
            </li>
        );

        return (
            <div>
                <nav>
                    <div className="nav-wrapper blue darken-1">
                        <Link to="/" className="brand-logo center">MEMOPAD</Link>

                        <ul>
                            <li><a onClick={this.toggleSearch}><i className="material-icons">search</i></a></li>
                        </ul>

                        <div className="right">
                            <ul>
                                {this.props.isLoggedIn ? logoutButton : loginButton}
                            </ul>
                        </div>
                    </div>
                </nav>
                <ReactCSSTransitionGroup transitionName="search"
                    transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    {this.state.search ? <Search
                        onClose={this.toggleSearch}
                        onSearch={this.props.onSearch}
                        usernames={this.props.usernames}
                    ></Search> : undefined}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

//props의 타입과 기본값 정하기
Header.propTypes = {
    isLoggedIn: PropTypes.bool,
    onLogout: PropTypes.func,
    onSearch: PropTypes.func,
    usernames: PropTypes.array
}

Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => {
        console.error("logout function not defined");
    },
    onSearch: () => {
        console.error("onSearch function not defined");
    },
    usernames: []
}

export default Header;