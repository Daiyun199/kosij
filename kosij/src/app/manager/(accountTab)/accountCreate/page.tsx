"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";

import React, { useState } from "react";
import "./staffCreate.css";
import api from "@/config/axios.config";
import { toast } from "react-toastify";
import ProtectedRoute from "@/app/ProtectedRoute";

interface FormValues {
  email: string;
  fullName: string;
  sex: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  area: string;
  role: string;
}

function Page() {
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    fullName: "",
    sex: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    area: "",
    role: "",
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [loading, setLoading] = useState(false);

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

    if (!formValues.fullName) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formValues.sex) {
      newErrors.sex = "Sex is required";
    }

    if (!formValues.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    }

    if (!formValues.area) {
      newErrors.area = "Area is required";
    }

    if (!formValues.role) {
      newErrors.role = "Role is required";
    }

    // if (!formValues.password) {
    //   newErrors.password = "Password is required";
    // } else if (formValues.password.length < 6) {
    //   newErrors.password = "Password must be at least 6 characters";
    // }

    // if (formValues.confirmPassword !== formValues.password) {
    //   newErrors.confirmPassword = "Passwords do not match";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const requestData = {
      email: formValues.email,
      fullName: formValues.fullName,
      sex: formValues.sex,
      password: "ABCDEF@1",
      confirmPassword: "ABCDEF@1",
      phoneNumber: formValues.phoneNumber,
      area: formValues.area,
      role: formValues.role,
    };

    try {
      await api.post("/manager/register/staff", requestData);
      toast.success("Register Successfull");
      setFormValues({
        email: "",
        fullName: "",
        sex: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        area: "",
        role: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error("Error: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="form-container">
        <ManagerLayout title="New Staff">
          <h1 className="form-title">Register New Member</h1>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formValues.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <span className="error">{errors.fullName}</span>
              )}
            </div>
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
              <label>Sex</label>
              <select name="sex" value={formValues.sex} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.sex && <span className="error">{errors.sex}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <span className="error">{errors.phoneNumber}</span>
              )}
            </div>
            <div className="form-group">
              <label>Area</label>
              <input
                type="text"
                name="area"
                value={formValues.area}
                onChange={handleChange}
              />
              {errors.area && <span className="error">{errors.area}</span>}
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formValues.role}
                onChange={handleChange}
              >
                <option value="">Select a role</option>
                <option value="SALESSTAFF">Sales Staff</option>
                <option value="CONSULTINGSTAFF">Consulting Staff</option>
                <option value="DELIVERYSTAFF">Delivery Staff</option>
                <option value="FARMBREEDER">Farm Breeder</option>
              </select>
              {errors.role && <span className="error">{errors.role}</span>}
            </div>
            {/* <div className="form-group">
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
          </div> */}
            {/* <div className="form-group">
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
          </div> */}
            <button className="staff-button" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </ManagerLayout>
      </div>
    </ProtectedRoute>
  );
}

export default Page;
