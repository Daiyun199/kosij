"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React, { useState } from "react";
import "./staffCreate.css";

interface FormValues {
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

function Page() {
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const newErrors: Partial<FormValues> = {};
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formValues.role) {
      newErrors.role = "Role is required";
    }

    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formValues.confirmPassword !== formValues.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully!", formValues);
    }
  };

  return (
    <div>
      <ManagerLayout title="New Staff">
        <h1>Create New Staff</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formValues.role} onChange={handleChange}>
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Reader">Reader</option>
            </select>
            {errors.role && <span className="error">{errors.role}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>
          <button className="staff-button" type="submit">
            Create
          </button>
        </form>
      </ManagerLayout>
    </div>
  );
}

export default Page;
