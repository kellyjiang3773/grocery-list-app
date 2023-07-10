import React from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ErrorNotifier } from './ErrorNotifier';
import { MyApolloProvider } from './MyApolloProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorNotifier>
    {(showError) => (
      <MyApolloProvider showError={showError}>
        <React.StrictMode>
          <SnackbarProvider autoHideDuration={5000}>
            <App />
          </SnackbarProvider>
        </React.StrictMode>
      </MyApolloProvider>
    )}
  </ErrorNotifier>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
