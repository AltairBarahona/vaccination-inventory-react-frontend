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

// const urlGetUsers = "http://localhost:3002/api/users/getAllUsers";
// const urlUpdateUser = "http://localhost:3002/api/users/updateUser";

const urlGetUsers =
  "https://vaccination-inventory-backend.herokuapp.com/api/users/getAllUsers";

const urlUpdateUser =
  "https://vaccination-inventory-backend.herokuapp.com/api/users/updateUser";

class Employee extends Component {
  /* Creating a state object */

  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: "",

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
    // delete this.state.form.id;

    axios
      .get(urlGetUsers)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  /* Function for open the modal for update my information. */
  peticionPut = async (event) => {
    try {
      await axios
        .put(
          urlUpdateUser + "/" + cookies.get("id"),
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
        firstName: employee.firstName,
        secondName: employee.secondName,
        paternalSurname: employee.paternalSurname,
        maternalSurname: employee.maternalSurname,
        email: employee.email,
        bornDate: employee.bornDate,
        address: employee.address,
        phone: employee.phone,
        vaccinationState: employee.vaccinationState,
        vaccineType: employee.vaccineType,
        dosesNumber: employee.dosesNumber,
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
                    <th>ID</th>
                    <th>Identification number</th>
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
                <br />
                <label htmlFor="id">ID</label>
                <input
                  required
                  className="form-control"
                  type="string"
                  name="id"
                  id="id"
                  readOnly
                  onChange={this.handleModalChange}
                  //validate required input
                  value={form ? form.id : ""}
                />
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
              {this.state.tipoModal === "update" ? (
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
