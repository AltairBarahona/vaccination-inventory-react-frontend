import React, { Component } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "./login.css";
import { Col, Container, Row } from "reactstrap";

/* Login backend url */
// const baseUrl = "http://localhost:3001/api/users/login";
const baseUrl =
  "https://vaccination-inventory-backend.herokuapp.com/api/users/login";

/* Session cookies */
const cookies = new Cookies();

class Login extends Component {
  /*Initial state of Login component */
  state = {
    form: {
      username: "",
      password: "",
    },
  };

  /*Persist changes in state */
  handleLoginFormChange = async (event) => {
    await this.setState({
      form: {
        ...this.state.form,
        [event.target.name]: event.target.value,
      },
    });
    console.log(this.state.form);
  };
  /*Login function. If success, save session cookies that will be used in the next page (redirect to admin or employee page)*/
  login = async () => {
    await axios
      .post(baseUrl, {
        username: this.state.form.username,
        password: this.state.form.password,
      })
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        console.log(response);
        if (response.success) {
          cookies.set("id", response.data.id, { path: "/" });
          cookies.set("firstName", response.data.firstName, { path: "/" });
          cookies.set("secondName", response.data.secondName, { path: "/" });
          cookies.set("paternalSurname", response.data.paternalSurname, {
            path: "/",
          });
          cookies.set("maternalSurname", response.data.maternalSurname, {
            path: "/",
          });
          cookies.set("email", response.data.email, { path: "/" });
          cookies.set("role", response.data.role, { path: "/" });
          alert(
            "Bienvenido " +
              response.data.firstName +
              " " +
              response.data.paternalSurname +
              " " +
              response.data.role
          );
          /*Redirect to specific page according to user role */
          if (response.data.role === "ADMIN") {
            window.location.href = "./admin";
          }
          if (response.data.role === "EMPLOYEE") {
            window.location.href = "./employee";
          }
        } else {
          alert("Wrong username or password");
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response?.data?.message);
      });
  };
  /*Life cycle, check if there is a role cookie */
  componentDidMount() {
    if (cookies.get("role") === "ADMIN") {
      window.location.href = "./admin";
    }
    if (cookies.get("role") === "EMPLOYEE") {
      window.location.href = "./employee";
    }
  }

  render() {
    return (
      /*Divide screen in two */
      <Container fluid>
        <Row>
          {/* left kruger image */}
          <Col md={6} className="background-image"></Col>

          {/* right login form */}
          <Col md={6} className="position-relative">
            <div className="container-principal">
              <div className="kruger-gif-img"></div>
              <div className="container-secundario">
                <div className="form-group">
                  <br />
                  <br />

                  <h4 className="text-align-right">Usuario</h4>
                  <div className="login-inputs-font-size">
                    <input
                      className="form-control"
                      type="text"
                      name="username"
                      onChange={this.handleLoginFormChange}
                    />
                  </div>

                  <br />
                  <br />
                  <h4>Contraseña: </h4>
                  <div className="login-inputs-font-size">
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                      onChange={this.handleLoginFormChange}
                    />
                  </div>

                  <br />
                  <button
                    className="btn btn-primary"
                    onClick={() => this.login()}
                  >
                    Iniciar sesión
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
