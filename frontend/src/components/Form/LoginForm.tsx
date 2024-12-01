import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../validation/authSchemas';
import { loginUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import './FormStyle.css';

interface LoginFormInputs {
    email: string;
    password: string;
}

export default function LoginForm() {
  const { login } = useAuth(); // Access the AuthContext
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema), // Apply validation schema
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await loginUser(data.email, data.password); // Call the API
      login(data.email, response.access_token); // Update global state
      navigate('/'); // Redirect to the home page
    } catch (error: any) {
      console.log(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="form-container">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='input-container'>
            <span>Email</span>
            <input className='input' {...register('email')} autoComplete="email"/>
            {errors.email && <span className='error-message'>{errors.email.message}</span>}
          </div>
          <div className='input-container'>
            <span>Password</span>
            <input className='input' {...register('password')} type="password" autoComplete="password" />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
    </div>
  )
}
