import React from 'react'
import styles from "./Input.module.css"
const Input = ({ label, placeholder, errorMessage, id, ...props }) => {
    return (
        <div className={styles.input}>
            <label htmlFor={id}>{label}</label>
            <input type="text" placeholder={placeholder} {...props} id={id} />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    )
}

export default Input