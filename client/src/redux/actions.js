export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATEPROFILE = 'UPDATEPROFILE';
export const CLOSEUPDATEPROFILE = 'CLOSEUPDATEPROFILE';

export const loginUser = () => {
  return {
    type: LOGIN,
  };
};

export const logoutUser = () => {
  return {
    type: LOGOUT,
  };
};

export const updateProfile = () => {
  return {
    type: UPDATEPROFILE,
  };
};

export const closeUpdateProfile = () => {
  return {
    type: CLOSEUPDATEPROFILE,
  };
};

export const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    editProfile: state.editProfile,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    login: () => dispatch(loginUser()),
    logout: () => dispatch(logoutUser()),
    updateProfile: () => dispatch(updateProfile()),
    closeUpdateProfile: () => dispatch(closeUpdateProfile()),
  };
};