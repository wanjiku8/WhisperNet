import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import API from "../api";

const AuthForm = ({ type = "login", onAuthSuccess }) => {
  const isLogin = type === "login";

  return (
    <div className="container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required(),
          password: Yup.string().min(4).required(),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const res = await API.post(`/auth/${type}`, values);
            if (res.data.access_token) {
              localStorage.setItem("token", res.data.access_token);
              onAuthSuccess();
            }
          } catch (err) {
            setErrors({ username: "Invalid credentials" });
          }
          setSubmitting(false);
        }}
      >
        {({ errors }) => (
          <Form>
            <Field name="username" placeholder="Username" />
            <div>{errors.username}</div>
            <Field name="password" type="password" placeholder="Password" />
            <div>{errors.password}</div>
            <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AuthForm;
