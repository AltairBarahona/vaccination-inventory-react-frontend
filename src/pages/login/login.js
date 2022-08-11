import React, { Component } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "./login.css";
import { Col, Container, Row } from "reactstrap";

const baseUrl = "http://localhost:3001/api/users/login";
const cookies = new Cookies();

class Login extends Component {
  state = {
    form: {
      username: "",
      password: "",
    },
  };

  handleLoginFormChange = async (event) => {
    await this.setState({
      form: {
        ...this.state.form,
        [event.target.name]: event.target.value,
      },
    });
    console.log(this.state.form);
  };

  login = async () => {
    await axios
      .get(
        baseUrl +
          "/" +
          this.state.form.username +
          "/" +
          this.state.form.password
      )
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        console.log(response);
        if (response.success) {
          cookies.set("id", response.data.id, { path: "/" });
          cookies.set("name", response.data.name, { path: "/" });
          cookies.set("lastName", response.data.lastName, { path: "/" });
          cookies.set("email", response.data.email, { path: "/" });
          alert(
            "Bienvenido " + response.data.name + " " + response.data.lastName
          );
          window.location.href = "./admin";
        } else {
          alert("Usuario o contraseña incorrectos");
        }
      })
      .catch((error) => {
        console.log("ESTADO======", this.state.form);

        console.log(error.message);
      });
  };

  componentDidMount() {
    if (cookies.get("id")) {
      window.location.href = "./admin";
    }
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col md={6} className="backgroundImage"></Col>

          <Col md={6} className="positionRelative">
            <div className="containerPrincipal">
              <div className="containerSecundario">
                <div className="form-group">
                  <h2>Usuario</h2>
                  <br />
                  <br />
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    onChange={this.handleLoginFormChange}
                  />
                  <br />
                  <br />
                  <h2>Contraseña: </h2>
                  <br />
                  <br />

                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    onChange={this.handleLoginFormChange}
                  />
                  <br />
                  <button
                    className="btn btn-primary"
                    onClick={() => this.login()}
                  >
                    {" "}
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
