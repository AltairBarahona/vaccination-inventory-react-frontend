import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import "./admin.css";
import Cookies from "universal-cookie";

/* Creating a new instance of the Cookies class. */
const cookies = new Cookies();

/* The above code is defining the URL's for the API calls. */
// const urlGetUsers = "http://localhost:3001/api/users/getAllUsers";
// const urlCreateUser = "http://localhost:3001/api/users/createUser";
// const urlUpdateUser = "http://localhost:3001/api/users/updateUser";
// const urlDeleteUser = "http://localhost:3001/api/users/deleteUser";
// https://vaccination-inventory-backend.herokuapp.com

const urlGetUsers =
  "https://vaccination-inventory-backend.herokuapp.com/api/users/getAllUsers";

const urlCreateUser =
  "https://vaccination-inventory-backend.herokuapp.com/api/users/createUser";
const urlUpdateUser =
  "https://vaccination-inventory-backend.herokuapp.com/api/users/updateUser";
const urlDeleteUser =
  "https://vaccination-inventory-backend.herokuapp.com/api/users/deleteUser";

class Admin extends Component {
  /* Creating a state object */
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
      bornDate: "",
      address: "",
      phone: "",
      vaccinationState: false,
      vaccineType: "",
      dosesNumber: 0,
    },
  };

  /* Making a GET request to the urlGetUsers endpoint for load all users. */
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
  /* Checking if the string is valid, only char characters, not numbers or rare symbols. */
  validString = (string) => {
    const isValid = /^[a-zA-Z???????????????????????? ]*$/.test(string);
    return isValid;
  };

  /* Function for open the modal for insert a new user. */
  peticionPost = async (event) => {
    /* Validate if email is valid with regex (check @ and . format) */
    const validEmail = String(this.state.form.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    /* Validate if names and surnames don??t have numbers or rare symbols */
    const validFirstName = this.validString(this.state.form.firstName);
    const validSecondName = this.validString(this.state.form.secondName);
    const validPaternalSurname = this.validString(
      this.state.form.paternalSurname
    );
    const validMaternalSurname = this.validString(
      this.state.form.maternalSurname
    );
    if (
      !validFirstName ||
      !validSecondName ||
      !validPaternalSurname ||
      !validMaternalSurname
    ) {
      alert("No se aceptan nombres con caracteres especiales ni n??meros");
      event.preventDefault();
      return;
    }

    if (this.state.form.identificationNumber.length !== 10) {
      alert("El n??mero de c??dula debe tener 10 d??gitos");
      event.preventDefault();
      return;
    }

    if (!validEmail) {
      alert("El correo no es v??lido");
      event.preventDefault();
      return;
    }
    /* If data has a correct format, do the http request to create user*/
    await axios
      .post(urlCreateUser, this.state.form)
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch((error) => {
        event.preventDefault();

        console.log(error.message);
      });
  };
  /* Function for open the modal for update a user. */
  peticionPut = async (event) => {
    try {
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
    } catch (error) {
      event.preventDefault();

      alert(error.response?.data?.message);
    }
  };
  /* Function for open the modal for delete a user. */
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
  /* Function for open or close the modal according to state. */
  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  handleModalChange = async (event) => {
    event.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [event.target.name]: event.target.value, //save in state according to input name
      },
    });
  };
  /* Function for persist user employee data in modal*/
  selectEmployee = (employee) => {
    this.setState({
      tipoModal: "update",
      form: {
        id: employee.id,
        identificationNumber: employee.identificationNumber,
        firstName: employee.firstName,
        secondName: employee.secondName,
        paternalSurname: employee.paternalSurname,
        maternalSurname: employee.maternalSurname,
        email: employee.email,
      },
    });
  };

  /* Removing cookies from the browser. */
  logout = () => {
    cookies.remove("id", { path: "/" });
    cookies.remove("firstName", { path: "/" });
    cookies.remove("secondName", { path: "/" });
    cookies.remove("paternalSurname", { path: "/" });
    cookies.remove("maternalSurname", { path: "/" });
    cookies.remove("email", { path: "/" });
    cookies.remove("role", { path: "/" });
    window.location.href = "./";
  };
  /*Go to root page it there is no id cookie */
  componentDidMount() {
    if (!cookies.get("id")) {
      window.location.href = "./";
    }

    this.peticionGet();
  }

  render() {
    const { form } = this.state;

    return (
      <div>
        <header className="header-background-img text-center">
          <img
            className="header-img"
            src="https://krugercorp.com/wp-content/uploads/2022/02/logo_kruger_english.png"
            alt="header"
          />
        </header>
        <div>
          <br />
          <br />

          <h1 className="text-center">VACCINATION INVENTORY</h1>
        </div>
        <div className="containerRegisterButton">
          <button
            className="btn button-kruger-color "
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
                        <td>{user.dosesNumber}</td>
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
                  Cerrar sesi??n
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
                <br />

                <label htmlFor="identificationNumber">
                  Identification Number
                </label>
                <input
                  required
                  className="form-control"
                  type="number"
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
          Est??s seguro que deseas eliminar a este empleado {form && form.name}
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
