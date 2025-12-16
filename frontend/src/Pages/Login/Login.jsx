import React, { useState } from 'react'
import { signUpSchema } from '../../validation-schema/authValidation'
import { useForm } from "react-hook-form";
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from "./Login.module.css"
import { loginSchema } from '../../validation-schema/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { NavLink, useNavigate } from 'react-router-dom';
import getApiURL from '../../utils/getApiURl';
import { toast } from "react-toastify"
import { useUserContext } from '../../context/userContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const {setUser} = useUserContext()
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await fetch(getApiURL("/api/auth/login"), {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        return toast.error(json.error.message || "Unable to login, please try again!")
      }
      const json = await response.json()
      setUser(json?.data?.user)
      navigate("/")
      toast.success("Logged in successfully")
    } catch (error) {
      toast.error(error.message || "Unable to login, please try again!")
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <div className={styles.pageCnt}>
      <div className={styles.page}>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("email")} placeholder={"Enter your email"} label="Email" type="email" errorMessage={errors?.email?.message} id={"email"} />
          <Input {...register("password")} placeholder={"Enter your password"} label="Password" type="password" errorMessage={errors?.password?.message} id={"password"} />
          <Button type="submit" loading={loading}>Submit</Button>
        </form>
        <span>Don't have an account <NavLink to={"/signup"}>Signup</NavLink> here</span>
      </div>

    </div>
  )
}

export default Login