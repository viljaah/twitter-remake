//types rafce for getting the basic layout
import React from 'react'
import {Link} from "react-router-dom";
import {useState} from "react";
//import from react icons
import {MdOutlineMail} from "react-icons/md";
import {FaUser} from "react-icons/fa";
import {MdPassword} from "react-icons/md";
import {MdDriveFileRenameOutline} from "react-icons/md";

const SignUpPage = () => {
    // the pure js goes here, while the html-like goes inside the return
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });

    const [isPending, setIsPending] = useState(false); 
    const [error, setError] = useState(null); 

    const handleSumbit = (e) => {
        e.preventDefault(); //page wont relaod
        console.log(formData);
    };

    // updates the state after the inputs (new change)
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const isError = false; //if there are any errors we will get "somehting went wrong" form the code down below, by defualt it is false, it will become true if there will be some errors

  return (
    <div className='main-signup-div'>
        <div className='svg-logo'>
            {/*here should the logo of the x go*/ }
        </div>
        <div className='submit-form'>
            <form onSubmit={handleSumbit}>
                <h1>Join today</h1>
                <label>
                    <MdOutlineMail />
                    <input
                    type='email'
                    className='grow'
                    placeholder='Email'
                    name='email'
                    onChange={handleInputChange}
                    value={formData.email}
                    />
                </label>
                <div className='input-second'>
                    <label>
                        <FaUser />
                        <input 
                            type='text'
                            className='grow'
                            placeholder='Username'
                            name='username'
                            onChange={handleInputChange}
                            value={formData.username} />
                    </label>
                </div>
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
						{isPending ? "Loading..." : "Sign up"}
					</button>
                    {isError && <p>{error.message}</p>}
            </form>
            <div>
					<p>Already have an account?</p>
					<Link to='/login'>
						<button>Sign in</button>
					</Link>
				</div>
        </div>
    </div>
  )
}

export default SignUpPage