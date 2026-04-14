import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './index.css';

// --- VERSION 1: NO FORM LIBRARY (Controlled Components) ---
const NoLibraryForm = () => {
  const [formData, setFormData] = useState({ title: '', price: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = "Title is required";
    if (!formData.price || formData.price <= 0) tempErrors.price = "Price must be greater than 0";
    if (formData.description.length < 10) tempErrors.description = "Description must be at least 10 chars";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('https://fakestoreapi.com/products', {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      });
    
      const data = await res.json();
      alert(`Success (No Library)! Product ID: ${data.id}`);
    } catch (err) {
      alert("Submission failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  
  };  
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>No Library Version</h3>
      <div className="field">
        <label>Product Title</label>
        <input name="title" value={formData.title} onChange={handleChange} />
        {errors.title && <p className="error">{errors.title}</p>}
      </div>
      <div className="field">
        <label>Price</label>
        <input name="price" type="number" value={formData.price} onChange={handleChange} />
        {errors.price && <p className="error">{errors.price}</p>}
      </div>
      <div className="field">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
};

// --- VERSION 2: WITH FORM LIBRARY (React Hook Form) ---
const LibraryForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('https://fakestoreapi.com/products', {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      const result = await res.json();
      alert(`Success (Hook Form)! Product ID: ${result.id}`);
      reset();
    } catch (err) {
      alert("Submission failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container library">
      <h3>React Hook Form Version</h3>
      <div className="field">
        <label>Product Title</label>
        <input {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="error">{errors.title.message}</p>}
      </div>
      <div className="field">
        <label>Price</label>
        <input type="number" {...register("price", { required: "Price is required", min: 1 })} />
        {errors.price && <p className="error">Price must be at least 1</p>}
      </div>
      <div className="field">
        <label>Description</label>
        <textarea {...register("description", { required: "Description is required", minLength: 10 })} />
        {errors.description && <p className="error">Min 10 characters required</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState('no-library');

  return (
    <div className="main-wrapper">
      <h1>Product Creator</h1>
      <div className="toggle-buttons">
        <button onClick={() => setView('no-library')} className={view === 'no-library' ? 'active' : ''}>
          No Library
        </button>
        <button onClick={() => setView('library')} className={view === 'library' ? 'active' : ''}>
          With Hook Form
        </button>
      </div>

      <hr />

      {view === 'no-library' ? <NoLibraryForm /> : <LibraryForm />}
    </div>
  );
}