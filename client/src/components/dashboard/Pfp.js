import React, { Component } from 'react';
import './Pfp.scss';

export default class Pfp extends Component {
  constructor(props){
    super(props);
    this.state = {
      success: false,
      error: null,
      selectedPicture: null,
      previewURL: null,
      updatePfp: false,
      pfpURL: JSON.parse(sessionStorage.getItem('currentUser')).profile.pfp || '../images/pfp.jpg'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit() {
    this.setState({updatePfp: false});
    const { selectedPicture } = this.state;
    const formData = new FormData();
    formData.append('file', selectedPicture);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/update-pfp`,
        {
          method: 'PUT',
          headers: {
            'Authorization': JSON.parse(sessionStorage.getItem('Authorization')),
          },
          body: formData
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }

      const result = await response.json();
      const headers = await response.headers;
      sessionStorage.setItem('Authorization', JSON.stringify(headers.get('Authorization')));
      sessionStorage.setItem('currentUser', JSON.stringify(result));

      this.setState({
        previewURL: null,
        selectedPicture: null,
        success: true,        
      });
    } catch(error) {
      this.setState({
        error: error.message, previewURL: null, selectedPicture: null
      });
    }
  }

  handleChange(event) {
    event.preventDefault();
    const selectedPicture = event.target.files[0];
    if (
      selectedPicture.type === 'image/jpg' ||
      selectedPicture.type === 'image/jpeg' ||
      selectedPicture.type === 'image/png'
    ) {
      this.setState({selectedPicture});
      const previewURL = URL.createObjectURL(selectedPicture);
      this.setState({previewURL});
    }
  }

  render() {
    const {
      success, error, selectedPicture, previewURL, pfpURL, updatePfp
    } = this.state;
    if (error) {
      (window.location.href = '/login');
      return ;
    }

    if (success) {
      (window.location.href = '/dashboard');
      return ;
    }

    return (
      <div className="pfp">
        {error && <div className="flash failed"><span>{error}</span></div>}
        <div
          className="pfpContainer"
          style={{
            backgroundImage: `url(${previewURL || pfpURL})`
          }}
        >
          <button onClick={() => this.setState({updatePfp: !updatePfp})}>
            <img src={"../images/pen.png"} alt="Change your profile picture" />
          </button>
        </div>
        {updatePfp && <div className="updatePfp">
          <input
            type="file"
            name="pfp"
            id="pfp"
            onChange={this.handleChange}
          />
          <span>file must be either *jpg, *jpeg, *png</span>
          {selectedPicture && <button type="submit" onClick={this.handleSubmit}>Upload</button>}
        </div>}
      </div>
    );
  }
}