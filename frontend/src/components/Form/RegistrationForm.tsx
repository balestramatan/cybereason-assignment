import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../validation/authSchemas';
import { loginUser, registerUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import './FormStyle.css';

interface RegisterFormInputs {
    email: string;
    password: string;
    repeatPassword: string;
}

export default function RegistrationForm() {
  const { login } = useAuth(); // Access the AuthContext
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema), // Apply validation schema
  });

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data.email, data.password, data.repeatPassword);
      
      // Automatically log the user in
      const response = await loginUser(data.email, data.password);
      login(data.email, response.access_token);

      navigate('/');

    } catch (error: any) {
      alert(error.response?.data?.message || 'Error registering user');
    }
  };
  
  return (
    <div className="form-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="input-container">
          <span>Email</span>
          <input className="input" {...register('email')} placeholder="Email" autoComplete='email'/>
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div className="input-container">
          <span>Password</span>
          <input className="input" {...register('password')} placeholder="Password" type="password"  autoComplete='current-password' />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div className="input-container">
          <span>Repeat Password</span>
          <input className="input" {...register('repeatPassword')} placeholder="Repeat Password" type="password"  autoComplete='new-password' />
          {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}
        </div>

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  )
}
