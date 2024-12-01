import React from 'react';
import AuthLayout from '../AuthLayout';
import RegistrationForm from '../../components/Form/RegistrationForm';

const Register: React.FC = () => {
  return (
    <AuthLayout>
      <RegistrationForm />
    </AuthLayout>
  );
};

export default Register;
