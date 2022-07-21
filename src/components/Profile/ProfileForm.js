import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory()
  const newPassword = useRef()
  const authCtx = useContext(AuthContext);

  const submitHandler = e => {
    e.preventDefault();

    const enteredNewPassword = newPassword.current.value;

    //add validation

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB672cp4Wmoc-MGP4F6OSp1uV5MEJnY-To',{
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      header: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      //assumption: always succeeds
      history.replace('/')
    })
  } 
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPassword}/>
      </div>
      <div className={classes.action}>
        <button >Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
