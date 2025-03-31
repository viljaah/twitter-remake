import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

  return (
    <div >
			<div>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div >
				<form  onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 >{"Let's"} go.</h1>
					<label>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div>
					<p>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
  )
}

export default LoginPage