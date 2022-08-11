import React, { Component } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Container,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import "./admin.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const urlGetUsers = "http://localhost:3001/api/users/getAllUsers";
const urlCreateUser = "http://localhost:3001/api/users/createUser";
const urlUpdateUser = "http://localhost:3001/api/users/updateUser";
const urlDeleteUser = "http://localhost:3001/api/users/deleteUser";

class Admin extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: "",
      identificationNumber: "",
      firstName: "",
      secondName: "",
      paternalSurname: "",
      maternalSurname: "",
      email: "",
      tipoModal: "",
    },
  };

  peticionGet = () => {
    delete this.state.form.id;
    axios
      .get(urlGetUsers)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  peticionPost = async (event) => {
    const validEmail = String(this.state.form.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    if (!validEmail) {
      alert("El correo no es válido");
      event.preventDefault();
      return;
    }

    await axios
      .post(urlCreateUser, this.state.form)
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        this.modalInsertar();
      });
  };

  peticionPut = async () => {
    await axios
      .put(
        urlUpdateUser + "/" + this.state.form.id,
        //send id in params request

        this.state.form
      )
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
      });
  };

  peticionDelete = async () => {
    await axios
      .delete(urlDeleteUser + "/" + this.state.form.id)
      .then((response) => {
        this.setState({ modalEliminar: false });
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  handleModalChange = async (event) => {
    //validate required fields

    event.persist();
    await this.setState({
      form: {
        ...this.state.form, //heredar atributos del form que no se borren cuando el usuario escriba
        [event.target.name]: event.target.value, //guardar en el estado de acuerdo al nombre del input
      },
    });
    console.log(this.state.form);
  };
  selectEmployee = (employee) => {
    this.setState({
      tipoModal: "update",
      form: {
        id: employee.id,
        identificationNumber: employee.identificationNumber,
        name: employee.name,
        secondName: employee.secondName,
        email: employee.email,
      },
    });
  };

  logout = () => {
    cookies.remove("id", { path: "/" });
    cookies.remove("name", { path: "/" });
    cookies.remove("secondName", { path: "/" });
    cookies.remove("email", { path: "/" });
    window.location.href = "./";
  };

  componentDidMount() {
    // if (!cookies.get("id")) {
    //   window.location.href = "./";
    // }

    this.peticionGet();
  }

  render() {
    console.log(cookies.get("id"));
    console.log(cookies.get("name"));
    console.log(cookies.get("secondName"));
    console.log(cookies.get("email"));

    const { form } = this.state;

    return (
      <div>
        <div className="containerRegisterButton">
          <button
            className="btn buttonDefaultColor "
            onClick={() => {
              this.setState({ form: null, tipoModal: "insertar" });
              this.modalInsertar();
            }}
          >
            Register employee
          </button>
        </div>
        <br></br>
        <Container fluid>
          <Row>
            <Col>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Identification number (CI)</th>
                    <th>First Name</th>
                    <th>Second Name</th>
                    <th>Paternal surname </th>
                    <th>Maternal surname </th>
                    <th>Email</th>
                    <th>Born date</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Vaccination state</th>
                    <th>Vaccine type</th>
                    <th>Doses number</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.map((user, index) => {
                    return (
                      <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.identificationNumber}</td>
                        <td>{user.firstName}</td>
                        <td>{user.secondName}</td>
                        <td>{user.paternalSurname}</td>
                        <td>{user.maternalSurname}</td>
                        <td>{user.email}</td>
                        <td>{user.bornDate}</td>
                        <td>{user.address}</td>
                        <td>{user.phone}</td>
                        <td>{user.vaccinationState}</td>
                        <td>{user.vaccineType}</td>
                        <td>{user.dossesNumber}</td>
                        <td>
                          <div className="buttonMargin">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                this.selectEmployee(user);
                                this.modalInsertar();
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </div>

                          <div className="buttonMargin">
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                this.selectEmployee(user);
                                this.setState({ modalEliminar: true });
                              }}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <br />
              <div className="text-center">
                <button
                  className="btn btn-success"
                  onClick={() => this.logout()}
                >
                  Cerrar sesión
                </button>
              </div>

              <br />
            </Col>
          </Row>
        </Container>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: "block" }}>
            <span
              style={{ float: "right" }}
              onClick={() => this.modalInsertar()}
            >
              x
            </span>
          </ModalHeader>
          <form onSubmit={this.peticionPost}>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="id">ID</label>
                <input
                  className="form-control"
                  type="text"
                  name="id"
                  id="id"
                  readOnly
                  onChange={this.handleModalChange}
                  value={form ? form.id : this.state.data.length + 1}
                />
                <br />

                <label htmlFor="identificationNumber">
                  Identification Number
                </label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="identificationNumber"
                  id="identificationNumber"
                  onChange={this.handleModalChange}
                  //validate required input
                  value={form ? form.identificationNumber : ""}
                />

                <br />

                <label htmlFor="firstName">First name</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="firstName"
                  id="firstName"
                  onChange={this.handleModalChange}
                  value={form ? form.firstName : ""}
                />
                <br />

                <label htmlFor="secondName">Second name</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="secondName"
                  id="secondName"
                  onChange={this.handleModalChange}
                  value={form ? form.secondName : ""}
                />
                <br />
                <label htmlFor="paternalSurname">Paternal surname</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="paternalSurname"
                  id="paternalSurname"
                  onChange={this.handleModalChange}
                  value={form ? form.paternalSurname : ""}
                />
                <br />
                <label htmlFor="maternalSurname">Maternal surname</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="maternalSurname"
                  id="maternalSurname"
                  onChange={this.handleModalChange}
                  value={form ? form.maternalSurname : ""}
                />
                <br />

                <label htmlFor="email">Email</label>
                <input
                  required
                  className="form-control"
                  type="email"
                  name="email"
                  id="email"
                  onChange={this.handleModalChange}
                  value={form ? form.email : ""}
                />
                <br />
              </div>
            </ModalBody>

            <ModalFooter>
              {this.state.tipoModal === "insertar" ? (
                <button className="btn btn-success" type="submit">
                  Insertar
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => this.peticionPut()}
                >
                  Actualizar
                </button>
              )}
              <button
                className="btn btn-danger"
                onClick={() => this.modalInsertar()}
              >
                Cancelar
              </button>
            </ModalFooter>
          </form>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          Estás seguro que deseas eliminar a este empleado {form && form.name}
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.peticionDelete()}
            >
              Si
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Admin;
