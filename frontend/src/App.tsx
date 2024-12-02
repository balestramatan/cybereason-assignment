import Header from './components/Header/Header';
import AppRoutes from './routes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {  
  return (
    <>
      <Header />
      <AppRoutes />
      <ToastContainer />
    </>
  )
}

export default App
