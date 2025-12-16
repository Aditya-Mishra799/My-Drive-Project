import React from 'react'
import styles from "./Button.module.css"

const Button = ({ children, loading, loadingMessage = "Submitting...", ...props }) => {
    return (
        <button className={styles.btn} {...props} >{loading ? loadingMessage : children}</button>
    )
}

export default Button