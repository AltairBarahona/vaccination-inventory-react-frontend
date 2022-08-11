import React, { Component } from "react";
import axios from "axios";
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
import "./employee.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();

/* The above code is defining the URL's for the API calls. */

const urlGetUsers = "http://localhost:3001/api/users/getAllUsers";
const urlCreateUser = "http://localhost:3001/api/users/createUser";
const urlUpdateUser = "http://localhost:3001/api/users/updateUser";
const urlDeleteUser = "http://localhost:3001/api/users/deleteUser";

class Employee extends Component {
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
    const isValid = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/.test(string);
    return isValid;
  };
  /* Function for open the modal for insert a new user. */

  peticionPost = async (event) => {
    const validEmail = String(this.state.form.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    /* Validate if email is valid with regex (check @ and . format) */

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
      alert("No se aceptan nombres con caracteres especiales ni números");
      event.preventDefault();
      return;
    }

    if (this.state.form.identificationNumber.length !== 10) {
      alert("El número de cédula debe tener 10 dígitos");
      event.preventDefault();
      return;
    }

    if (!validEmail) {
      alert("El correo no es válido");
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
        console.log(error.message);
      })
      .finally(() => {
        this.modalInsertar();
      });
  };

  /* Function for open the modal for update my information. */
  peticionPut = async (event) => {
    try {
      await axios
        .put(
          urlUpdateUser + "/" + this.state.form.id,
          //send id in params request

          this.state.form
        )
        .then((response) => {
          // this.modalInsertar();
          // this.peticionGet();
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

  /* Removing the cookies from the browser. */

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
        <div className="header-background-img text-center">
          <img
            className="header-img"
            src="https://krugercorp.com/wp-content/uploads/2022/02/logo_kruger_english.png"
            alt="header"
          />
        </div>
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
            Update my information
          </button>
        </div>
        <br></br>
        <Container fluid>
          <Row>
            <Col>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
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
                    if (user.id === cookies.get("id")) {
                      return (
                        <tr key={index}>
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
                        </tr>
                      );
                    } else {
                      return <div></div>;
                    }
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
                <br />

                <label htmlFor="bornDate">Born date</label>
                <input
                  required
                  className="form-control"
                  type="date"
                  name="bornDate"
                  id="bornDate"
                  onChange={this.handleModalChange}
                  //validate required input
                  value={form ? form.bornDate : ""}
                />

                <br />

                <label htmlFor="address">Address</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="address"
                  id="address"
                  onChange={this.handleModalChange}
                  value={form ? form.address : ""}
                />
                <br />

                <label htmlFor="phone">Phone</label>
                <input
                  required
                  className="form-control"
                  type="number"
                  name="phone"
                  id="phone"
                  onChange={this.handleModalChange}
                  value={form ? form.phone : ""}
                />
                <br />

                <div class="form-check form-switch">
                  <label class="vaccinationState" for="flexSwitchCheckDefault">
                    Vaccinated
                  </label>
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="vaccinationState"
                    id="vaccinationState"
                    onChange={this.handleModalChange}
                    value={form ? form.vaccinationState : ""}
                  />
                </div>

                <br />
                <label htmlFor="vaccineType">Vaccine type</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="vaccineType"
                  id="vaccineType"
                  onChange={this.handleModalChange}
                  value={form ? form.vaccineType : ""}
                />
                <br />
                <label htmlFor="dosesNumber">Doses number</label>
                <input
                  required
                  className="form-control"
                  type="number"
                  name="dosesNumber"
                  id="dosesNumber"
                  onChange={this.handleModalChange}
                  value={form ? form.dosesNumber : ""}
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

export default Employee;
