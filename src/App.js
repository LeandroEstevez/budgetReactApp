import './App.css';
import ExpensesPage from './components/pages/ExpensesPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoginPage from './components/pages/LoginPage';
import CreateAccountPage from './components/pages/CreateAccountPage';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import AccountPage from './components/pages/AccountPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#732753',
      contrastText: '#EBEDE9',
    },
    secondary: {
      main: '#F7F3F3',
      contrastText: '#4167c3',
    },
    error: {
      main: '#f44336',
      contrastText: '#EBEDE9',
    },
    warning: {
      main: '#f44336',
      contrastText: '#EBEDE9',
    },
    info: {
      main: '#4a3e6b',
      contrastText: '#EBEDE9',
    },
    success: {
      main: '#588651',
      contrastText: '#EBEDE9',
    },
    text: {
      primary: "#1b151f",
      secondary: "#1b151f"
    },
    background: {
      paper: "#EBEDE9",
      default: "#EBEDE9",
    },
    lightText: {
      main: "#EBEDE9"
    }
  },
});

function App() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    let acc = JSON.parse(window.localStorage.getItem('account'));
    if (acc !== null) {
      setAccount({ ...acc });
      console.log("Setting account in app.js");
    }
  }, []);

  useEffect(() => {
    if (account != null) {
      window.localStorage.setItem('account', JSON.stringify(account));
    }
  }, [account]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Routes>
            <Route path="/" element={<CreateAccountPage setAccount={setAccount} />} />
            <Route exact path="/login" element={<LoginPage setAccount={setAccount} />} />
            <Route exact path="/expenses" element={<ExpensesPage account={account} setAccount={setAccount} />} />
            <Route exact path="/forgotPassword" element={<ForgotPasswordPage></ForgotPasswordPage>} />
            {/* {account && <Route exact path="/account" element={<AccountPage account={account} setAccount={setAccount}></AccountPage>} />} */}
            <Route  path="/resetPassword/:token" element={<ResetPasswordPage></ResetPasswordPage>} />
          </Routes>
        </CssBaseline>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
