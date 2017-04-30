/*eslint-disable no-unused-vars*/
/*eslint-disable no-undef*/
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import React, { Component, PropTypes } from 'react';
import TinyMCE from 'react-tinymce';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import newDocument from '../../actions/documentManagement/newDocument';
import Validation from '../../helper/validation';

const validate = new Validation();

export class CreateDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      access: '',
      status: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  componentDidMount(){
     //$('#access').material_select(this.handleChange.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'success') { 
      toastr.info('Document successfully created ');
      browserHistory.push('/dashboard');
      return null
    }
    toastr.error('title already exist');
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleEditorChange(event) {
    this.setState({ content : event.target.getContent() }); 
  }

  handleSubmit(event) {
    event.preventDefault();
    if(validate.isEmpty(this.state.title)){
      toastr.error('Please enter a valid title', 'Error!')
      return false
    } else if(validate.isEmpty(this.state.content)){
      toastr.error('Please enter the document contents')
      return false
    }
    this.props.CreateDocument(this.state);
  }

  render() {
    if (!window.localStorage.getItem('token')) {
      browserHistory.push('/');
    }
    return (
      <div className="row dashboardContainer col s12">
        <Header />
        <Sidebar />
        <div className="col s12 workspace">
          <div className="row workspace-header"><h4>Create A Document</h4></div>
          <form onSubmit={this.handleSubmit} className="panel">
            <div className="field row">
              <div className="col m9 s12 document-name-field">
                <input
                  type="text" name="title"
                  id="title"
                  onChange={this.handleChange}
                  placeholder="Name of Document"
                />
              </div>
              <div className="col m3 s12">
                <select
                  name="access"
                  id="access"
                  onChange={this.handleChange}
                  value={this.state.value}
                  className="browser-default"
                >
                  <option value="" disabled >Select Access Type</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="role">Role</option>
                </select>
              </div>
            </div>
            <div className="field row">
              <TinyMCE
                name="content"
                id="content"
                content="Type your content here..."
                config={{
                  plugins: 'link image code',
                  toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                  }}
                onChange={this.handleEditorChange}
              />
            </div>
            <div className="field row">
              <button className="btn" type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>

    );
  }
}


CreateDocument.contextTypes = {
  router: PropTypes.object
};

const mapStoreToProps = (state) => {
  return {
    status: state.allDocumentsReducer.status
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    CreateDocument: documentDetails => dispatch(newDocument(documentDetails)),
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(CreateDocument);
