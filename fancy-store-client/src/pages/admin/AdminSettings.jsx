import { AdminStyles } from './AdminProducts';

const AdminSettings = () => {
  const settings = [
    { section: '🏪 Store Information', fields: [
      { label: 'Store Name', value: 'Fancy Store', type: 'text', id: 'store-name' },
      { label: 'Store Email', value: 'support@fancystore.com', type: 'email', id: 'store-email' },
      { label: 'Store Phone', value: '+91 98765 43210', type: 'tel', id: 'store-phone' },
      { label: 'Store Address', value: 'Chennai, Tamil Nadu, India', type: 'text', id: 'store-address' },
    ]},
    { section: '🚚 Delivery Settings', fields: [
      { label: 'Free Delivery Above (₹)', value: '500', type: 'number', id: 'free-delivery' },
      { label: 'Standard Delivery Charge (₹)', value: '50', type: 'number', id: 'delivery-charge' },
      { label: 'Express Delivery Charge (₹)', value: '100', type: 'number', id: 'express-charge' },
    ]},
    { section: '💰 Tax Settings', fields: [
      { label: 'GST Rate (%)', value: '18', type: 'number', id: 'gst-rate' },
      { label: 'GST Number', value: 'GSTIN123456789', type: 'text', id: 'gst-number' },
    ]},
    { section: '💳 Payment Gateway', fields: [
      { label: 'Razorpay Key ID', value: 'rzp_test_XXXX', type: 'text', id: 'rzp-key' },
      { label: 'Razorpay Secret (masked)', value: '••••••••••••', type: 'password', id: 'rzp-secret' },
    ]},
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Configure your store preferences</p>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(440px,1fr))', gap:'20px'}}>
        {settings.map((section) => (
          <div key={section.section} className="admin-card">
            <h2 style={{fontSize:'16px',fontWeight:700,color:'#fff',margin:'0 0 20px',paddingBottom:'12px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{section.section}</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {section.fields.map(f => (
                <div key={f.id} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input type={f.type} defaultValue={f.value} className="form-input" id={f.id} />
                </div>
              ))}
            </div>
            <div style={{marginTop:'16px',paddingTop:'14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
              <button className="btn-primary" style={{fontSize:'13px',padding:'8px 16px'}}>Save Changes</button>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2 style={{fontSize:'16px',fontWeight:700,color:'#fff',margin:'0 0 16px'}}>🖼️ Website Banners</h2>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,0.45)',marginBottom:'16px'}}>Manage homepage banners and promotional images.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}}>
          {[1,2,3].map(i => (
            <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'2px dashed rgba(99,102,241,0.2)',borderRadius:'12px',padding:'30px',textAlign:'center',cursor:'pointer',transition:'all 0.2s'}}
              onMouseOver={e=>e.currentTarget.style.borderColor='rgba(99,102,241,0.4)'}
              onMouseOut={e=>e.currentTarget.style.borderColor='rgba(99,102,241,0.2)'}>
              <div style={{fontSize:'32px',marginBottom:'8px'}}>🖼️</div>
              <div style={{fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>Banner {i}</div>
              <div style={{fontSize:'12px',color:'rgba(99,102,241,0.7)',marginTop:'4px'}}>Click to upload</div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card" style={{background:'rgba(239,68,68,0.04)',borderColor:'rgba(239,68,68,0.1)'}}>
        <h2 style={{fontSize:'16px',fontWeight:700,color:'#fca5a5',margin:'0 0 12px'}}>⚠️ Danger Zone</h2>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,0.45)',marginBottom:'16px'}}>These actions are irreversible. Proceed with caution.</p>
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
          <button style={{padding:'9px 18px',borderRadius:'10px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',color:'#f87171',fontSize:'14px',fontWeight:600,cursor:'pointer'}} id="clear-cache-btn">
            🗑️ Clear Cache
          </button>
          <button style={{padding:'9px 18px',borderRadius:'10px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',color:'#f87171',fontSize:'14px',fontWeight:600,cursor:'pointer'}} id="export-db-btn">
            📤 Export Database
          </button>
        </div>
      </div>

      <AdminStyles />
    </div>
  );
};

export default AdminSettings;
