import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { jwtDecode } from "jwt-decode";




const EditProductModal = ({ isOpen, onClose, product }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [loading, setLoading] = useState(false);
  const userRole = jwtDecode(localStorage.getItem("token")).role;

  // Update the editedProduct state when the product prop changes
  useEffect(() => {
    setEditedProduct({ ...product });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/products/${editedProduct._id}`, editedProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Product updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
    setLoading(false);
  };

  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 ${isOpen ? 'visible' : 'invisible'}`}>
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name:</label>
            <input type="text" id="name" name="name" value={editedProduct.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">Description:</label>
            <input type="text" id="description" name="description" value={editedProduct.description} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700">Location:</label>
            <input type="text" id="location" name="location" value={editedProduct.location} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700">Category:</label>
            <input type="text" id="category" name="category" value={editedProduct.category} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2" />
          </div>
          {/* Render features input fields */}
          {/* Add more fields as needed */}

          {/* Render isApproved field for admin */}
          {userRole === 'admin' && (
            <div className="mb-4">
              <label htmlFor="isApproved" className="block text-gray-700">Approved:</label>
              <select id="isApproved" name="isApproved" value={editedProduct.isApproved} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2">
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
          )}

          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" disabled={loading}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};







const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState('users'); // State to track active menu item
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userRole = jwtDecode(localStorage.getItem("token")).role;
  const userId = jwtDecode(localStorage.getItem("token")).userId;

  useEffect(() => {
    // Fetch JWT token from local storage
    const token = localStorage.getItem('token');

    // Fetch users data with JWT token included in headers
    axios.get(`${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));

    // Fetch all products data with JWT token included in headers
    axios.get(`${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/get-products`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setProducts(res.data);
        // Filter user's products
        const userProducts = res.data.filter(product => product.createdBy === userId);
        setMyProducts(userProducts);
      })
      .catch(err => console.error(err));
  }, []);


 const handleDelete = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/products/remove/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Filter out the deleted product from the state
    setMyProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
    alert('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Failed to delete product');
  }
};

  // Function to handle editing a product
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-1/4 h-full bg-gray-800 p-8 overflow-y-auto">
        <h1 className="text-white text-xl mb-4">Dashboard</h1>
        <ul className="text-white">
          <li className={`mb-2 cursor-pointer hover:text-gray-300 ${activeMenu === 'users' && 'text-gray-300'}`} onClick={() => setActiveMenu('users')}>Users</li>
          <li className={`mb-2 cursor-pointer hover:text-gray-300 ${activeMenu === 'products' && 'text-gray-300'}`} onClick={() => setActiveMenu('products')}>All Products</li>
          <li className={`mb-2 cursor-pointer hover:text-gray-300 ${activeMenu === 'myProducts' && 'text-gray-300'}`} onClick={() => setActiveMenu('myProducts')}>My Products</li>
        </ul>
      </div>
      <div className="w-3/4 h-full p-8 overflow-y-auto">
        {/* Render Users */}
        {activeMenu === 'users' && (
          <>
            <h1 className="text-white text-2xl mb-4">Users</h1>
            <div className="overflow-x-auto">
              <table className="w-full table-auto bg-gray-700 text-white rounded">
                <thead>
                  <tr>
                    <th className="border border-white px-4 py-2">Name</th>
                    <th className="border border-white px-4 py-2">Mobile Number</th>
                    <th className="border border-white px-4 py-2">Created At</th>
                    <th className="border border-white px-4 py-2">User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td className="border border-white px-4 py-2">{user.username}</td>
                      <td className="border border-white px-4 py-2">{user.mobileNumber}</td>
                      <td className="border border-white px-4 py-2">{user.createdAt}</td>
                      <td className="border border-white px-4 py-2">{user._id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Render All Products */}
        {activeMenu === 'products' && (
          <>
          <div className='flex justify-between mb-3'>

            <h1 className="text-white text-2xl mb-4">Products</h1>
            <div className="flex justify-end">
          <Link to="/add-product" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Product
          </Link>
        </div>
          </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto bg-gray-700 text-white rounded">
                <thead>
                  <tr>
                    <th className="border border-white px-4 py-2">Name</th>
                    <th className="border border-white px-4 py-2">Product ID</th>
                    <th className="border border-white px-4 py-2">Created At</th>
                    <th className="border border-white px-4 py-2">Created By</th>
                    <th className="border border-white px-4 py-2">Verified</th>
                    <th className="border border-white px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td className="border border-white px-4 py-2">{product.name}</td>
                      <td className="border border-white px-4 py-2">{product._id}</td>
                      <td className="border border-white px-4 py-2">{product.createdAt}</td>
                      <td className="border border-white px-4 py-2">{product.createdBy}</td>
                      {
                        product.isApproved === true ? <td className="border border-white px-4 py-2">Yes</td> : <td className="border border-white px-4 py-2">No</td>
                      }
                      <td className='border border-white px-4 py-2'><button onClick={() => handleEdit(product)} className=' bg-blue-500 text-white font-semibold w-20 h-8'>Edit</button></td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
              
            </div>
          </>
        )}
      
        {/* Render My Products */}
        {activeMenu === 'myProducts' && (
  <>
    <h1 className="text-white text-2xl mb-4">My Products</h1>
    <div className="overflow-x-auto">
      <table className="w-full table-auto bg-gray-700 text-white rounded">
        <thead>
          <tr>
            <th className="border border-white px-4 py-2">Name</th>
            <th className="border border-white px-4 py-2">Product ID</th>
            <th className="border border-white px-4 py-2">Created At</th>
            <th className="border border-white px-4 py-2">Created By</th>
            <th className="border border-white px-4 py-2">Verified</th>
            <th className="border border-white px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {myProducts.map(product => (
            <tr key={product._id}>
              <td className="border border-white px-4 py-2">{product.name}</td>
              <td className="border border-white px-4 py-2">{product._id}</td>
              <td className="border border-white px-4 py-2">{product.createdAt}</td>
              <td className="border border-white px-4 py-2">{product.createdBy}</td>
              <td className="border border-white px-4 py-2">{product.isApproved ? 'Yes' : 'No'}</td>
              <td className='border border-white px-4 py-2'>
                <button onClick={() => handleEdit(product)} className='bg-blue-500 text-white font-semibold w-20 h-8 mr-2'>Edit</button>
                <button onClick={() => handleDelete(product._id)} className='bg-red-500 text-white font-semibold w-20 h-8'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}

      </div>

      <EditProductModal isOpen={isModalOpen} onClose={closeModal} product={selectedProduct} />
    </div>
  );
};

export default AdminDashboard;

