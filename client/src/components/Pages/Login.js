import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
import Alert from '../Layout/Alert';

const Login = ({ setAlert }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        setAlert('Invalid login', 'danger', 5000);
    }

    return (
        <div className="login">
            <div className="login-content">
                <h1>Login</h1>
                <form onSubmit={e => onSubmit(e)}>
                    <div className="form-field">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            onChange={e => onChange(e)}
                            value={username} />
                    </div>
                    <div className="form-field">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            onChange={e => onChange(e)}
                            value={password} />
                    </div>
                    <Alert/>
                    <div className="form-field">
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

Login.propTypes = {
    setAlert: PropTypes.func.isRequired
}

export default connect(null, { setAlert })(Login);