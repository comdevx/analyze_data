import React, { Component } from 'react'
import {
  Row,
  Col,
  Button,
  Table,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap'
import ReactFileReader from 'react-file-reader'
import dataAnalyze from '../../libs/dataAnalyze'
import logo from './logo.svg'
import './App.css'

export default class App extends Component {

  state = {
    fields: null,
    data: null,
    result: null,
    fileName: '',
    fieldSelected: 'like',
    groupLimit: 3,
    groupName: 'group name'
  }

  handleFiles = (files) => {
    var reader = new FileReader()
    reader.readAsText(files[0])
    reader.onload = () => {
      this.setState({
        data: reader.result.split('\r\n'),
        fileName: files[0].name
      })
    }
  }

  handleInput = (f, v) => {
    if (f === 'groupLimit') {
      this.setState({ [f]: Number(v.target.value) })
    } else {
      this.setState({ [f]: v.target.value })
    }
  }

  handleProcess = () => {
    const { fieldSelected, data, groupLimit } = this.state
    const fields = getFields(data, fieldSelected)
    const obj = getData(data, fields)
    const result = dataAnalyze(obj, groupLimit)
    this.setState({ fields, result })
  }

  handleButton = () => {

  }

  render() {

    const { fields, data, result, groupName, fieldSelected, groupLimit } = this.state


    const header = (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Data analyze</h1>
      </header>
    )

    const buttonUpload = (
      <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
        <Button bsStyle="primary">Upload .csv file</Button>
      </ReactFileReader>
    )

    const form = (
      <form>
        <FormGroup>
          <ControlLabel>please enter group amout</ControlLabel>
          <FormControl
            type="text"
            value={groupLimit}
            placeholder={groupLimit}
            onChange={this.handleInput.bind(this, 'groupLimit')}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>please enter group name</ControlLabel>
          <FormControl
            type="text"
            value={groupName}
            placeholder={groupName}
            onChange={this.handleInput.bind(this, 'groupName')}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>please enter field name</ControlLabel>
          <FormControl
            type="text"
            value={fieldSelected}
            placeholder={fieldSelected}
            onChange={this.handleInput.bind(this, 'fieldSelected')}
          />
          <ControlLabel>(example like1 like2 like3 you just enter to input like)</ControlLabel>
        </FormGroup>
      </form>
    )

    const processButton = data ? (
      <Button bsStyle="success" onClick={() => this.handleProcess()} >Process</Button>
    ) : (
        <Button bsStyle="success" onClick={() => this.handleProcess()} disabled>Process</Button>
      )

    const downloadButton = (
      <Button disabled>Download</Button>
    )

    const table = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <th>name</th>
            {fields && fields.map((val, key) => (
              <th key={key}>{val}</th>
            ))}
            <th>compare</th>
            <th>{groupName}</th>
          </tr>
        </thead>
        <tbody>
          {result && result.map((val, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>{Object.keys(val)[0]}</td>
              {val.data.map((val2, key2) => (
                <td key={key2}>{val2}</td>
              ))}
              <td>{val.compare}</td>
              <td>{val[Object.keys(val)[0]]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )

    return (
      <div className="App">
        {header}
        <div className="App-intro">
          <Row className="show-grid">
            <Col xs={4} md={4}>
              {buttonUpload}
              {form}
            </Col>
            <Col xs={4} md={4}>
              {processButton}
            </Col>
            <Col xs={4}>
              {downloadButton}
            </Col>
          </Row>
          {table}
        </div>
      </div>
    )
  }
}

const getFields = (docs, fieldSelected) => {
  let result = []
  docs[0].split(',').map((field, index) => {
    const match = new RegExp(fieldSelected, 'g')
    return field.toLowerCase().match(match) && result.push(index)
  })
  return result
}

const getData = (data, fields) => {
  let result = []
  for (let i = 1; i < data.length; i++) {
    const arr = data[i].split(',')
    let arr2 = []
    arr2.name = arr[0]
    arr2.data = fields.map(val => {
      return arr[val]
    })
    result.push(arr2)
  }
  return result
}