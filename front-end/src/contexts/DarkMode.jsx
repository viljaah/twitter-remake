// contect provides a way to pass data through the component tree wthoug having to pass props down manually at every level
// https://medium.com/lets-make-something-up/creating-light-dark-mode-on-a-react-app-with-context-589a5465f639 this article was used to help apply this approach
/* Context API
*createContext() is a react function that creates context object
*/
import React, {createContext, useState, useEffect} from 'react';

const DarkModeContext = createContext();

// defining what theme modes are accessible, those are theme modes OBJECTS
// here im using constant isntead of strings direclty beause it prevents typos and makes coe mode maintainble
export const THEME_MODES = {
    DARK: 'dark',
    DIM: 'dim',
    LIGHT: 'light'
};

function DarkModeProvider(props) {
    const [themeMode, setThemeMode] = useState(() => {
        // using the localSTorage for setting the theme mode because it then persist the theme between page refreshes => if you set a light mode and come back to teh page later it will sitll be on the light mode 
        return localStorage.getItem('theme') || THEME_MODES.DARK; // or by default the dark mode
    });

    useEffect(() => {
        localStorage.setItem('theme', themeMode);
        //apllying data attribute to body
        document.body.setAttribute('data-theme', themeMode);
    }, [themeMode]);

    return(
        <div>
            <DarkModeContext.Provider value={{themeMode, setThemeMode}}>
                {props.children}
            </DarkModeContext.Provider>
        </div>
    )
};

export {DarkModeContext, DarkModeProvider};