import React, { useState } from 'react'
import { signUpSchema } from '../../validation-schema/authValidation'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./SignUp.module.css"
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import getApiURL from '../../utils/getApiURl';
import { toast } from "react-toastify"

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema)
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await fetch(getApiURL("/api/auth/signup"), {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const json = await response.json()
      if (!response.ok) {
        return toast.error(json.error.message || "Unable to signup, please try again!")
      }
      toast.success("Account created successfully! Please login.")
      navigate("/login")
    } catch (error) {
      toast.error(error.message || "Unable to signup, please try again!")
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <div className={styles.pageCnt}>
      <div className={styles.page}>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("name")} placeholder={"Enter your name"} label="Name" type="name" errorMessage={errors?.name?.message} id={"name"} />
          <Input {...register("email")} placeholder={"Enter your email"} label="Email" type="email" errorMessage={errors?.email?.message} id={"email"} />
          <Input {...register("password")} placeholder={"Enter your password"} label="Password" type="password" errorMessage={errors?.password?.message} id={"password"} />
          <Button type="submit" loading={loading}>Submit</Button>
        </form>
        <span>Already have an account? <NavLink to={"/login"}>Login</NavLink> here</span>
      </div>

    </div>
  )
}

export default SignUp