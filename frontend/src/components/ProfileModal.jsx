import React, { useState } from 'react';
import axios from 'axios';

function ProfileModal({ isOpen, onClose, user, onUpdateUser, totalTransactions, apiBaseUrl, token }) {
  if (!isOpen) return null;

  const [name, setName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const cleanBase = (apiBaseUrl || 'https://fintrack-expense-tracker-2cis.onrender.com/api')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ text: '', type: '' });

    try {
      const res = await axios.put(
        `${cleanBase}/api/auth/update-profile`,
        { name, newPassword: newPassword || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdateUser(res.data.user);
      setStatusMsg({ text: 'Profile updated successfully!', type: 'success' });
      setNewPassword('');
    } catch (err) {
      setStatusMsg({
        text: err.response?.data?.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
      }}
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          width: '90%',
          maxWidth: '440px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>👤 Account Profile</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        {/* Profile Stats Summary */}
        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Email:</span>
            <strong>{user?.email}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#64748b' }}>Total Transactions Recorded:</span>
            <strong>{totalTransactions} records</strong>
          </div>
        </div>

        {statusMsg.text && (
          <div
            style={{
              padding: '10px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '14px',
              backgroundColor: statusMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: statusMsg.type === 'success' ? '#065f46' : '#991b1b',
              border: `1px solid ${statusMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
            }}
          >
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="custom-form">
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password (Optional)</label>
            <input
              type="password"
              placeholder="Leave blank to keep same"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;