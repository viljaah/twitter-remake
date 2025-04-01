import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // these are placeholder variables
  const isPending = false;
  const isError = false;
  const error = { message: ""};

  const loginMutation = (data) => {
	console.log("Attempting to login with:", data);
	// this would normally be my API call to authenticate
  }

  const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

  return (
	<div >
    <div className={styles.container}>
			<div className={styles.logoContainer}>
				<XSvg className={styles.logo} />
			</div>
			<div className={styles.formContainer}>
				<form  onSubmit={handleSubmit} className={styles.form}>
					<h1 className={styles.heading}>{"Let's"} go.</h1>
					<label className={styles.inputLabel}>
						<MdOutlineMail className={styles.icon} />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className={styles.inputLabel}>
						<MdPassword className={styles.icon}/>
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className={styles.loginButton}>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className={styles.signupContainer}>
					<p>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className={styles.signupButton}>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	</div>
  )
}

export default LoginPage