import { useCallback, useState } from "react";


export const ErrorNotifier = ({ children }) => {
    const [doShowError, setDoShowError] = useState(false);
    const showError = useCallback((msg) => {
        console.log("[ErrorNotifier] error msg: " + msg);
        setDoShowError(true);
    }, []);
    
    return (
        <>
            {doShowError ? (
                <>
                    <h1 role="alert">Error!</h1>
                    <button onClick={() => setDoShowError(false)}>Dismiss</button>
                </>
            ) : null}
            {children(showError)}
        </>
    );
}
